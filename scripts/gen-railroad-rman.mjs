/**
 * 生成 docs/v8/rman 下 dmrman 命令语法的铁路图（SVG）并更新对应 .md 文件。
 *
 * 每个命令的语法块可能包含一条或多条主语句，以及若干 `<xxx>::= ...` 子规则定义；
 * 每一条主语句、每一个子规则各生成一张独立的铁路图，与原始 BNF 文本中的拆分方式一致。
 * 过长的图会按宽度自动拆成多行（每行一张 SVG，纵向堆叠），过长行使用双线起止符
 * （ComplexDiagram）表示"续行"，避免单张图横向过长难以阅读。
 *
 * 规范：
 * - Choice(defaultIndex, ...items): defaultIndex 指向的选项走直通路径，表示默认值
 * - 颜色：SVG 内嵌 prefers-color-scheme，浅色/深色模式均可正常显示
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const rr = require('railroad-diagrams');

const {
  Diagram,
  ComplexDiagram,
  Sequence,
  Choice,
  Optional,
  OneOrMore,
  Terminal,
  NonTerminal,
  Comment,
} = rr;

const CSS = `
.railroad-diagram { background: transparent; }
.railroad-diagram path { stroke-width: 2; stroke: #374151; fill: none; }
.railroad-diagram text { font: bold 13px monospace; text-anchor: middle; fill: #111827; }
.railroad-diagram text.comment { font: italic 12px monospace; fill: #6b7280; }
.railroad-diagram rect { stroke-width: 2; stroke: #374151; fill: #f3f4f6; }
`.trim();

function makeSVG(diagram) {
  let svg = diagram.toString();
  svg = svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
  svg = svg.replace(/(<svg[^>]*>)\n/, `$1\n<style>${CSS}</style>\n`);
  return svg;
}

const ROW_GAP = 14;

/**
 * 把若干张已经各自 format() 完成的行图纵向拼接成一张完整的 SVG（单个文件、单个
 * <img>），而不是生成多张图分别用多个 <img> 堆叠。每行已经是独立的 Diagram/
 * ComplexDiagram 对象，这里只是把它们的内部内容平移叠放进同一个画布。
 */
function mergeRowsToSVG(rows) {
  if (rows.length === 1) return makeSVG(rows[0]);

  const parts = rows.map((diagram) => {
    if (!diagram.formatted) diagram.format();
    const inner = diagram
      .toString()
      .replace(/^<svg[^>]*>\n?/, '')
      .replace(/<\/svg>\s*$/, '');
    return { width: diagram.attrs.width, height: diagram.attrs.height, inner };
  });

  const width = Math.max(...parts.map((p) => p.width));
  let y = 0;
  const groups = parts.map((p, i) => {
    const g = `<g transform="translate(0,${y})">${p.inner}</g>`;
    y += p.height + (i < parts.length - 1 ? ROW_GAP : 0);
    return g;
  });
  const height = y;

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" class="railroad-diagram" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n` +
    `<style>${CSS}</style>\n${groups.join('\n')}\n</svg>\n`
  );
}

const MAX_ROW_WIDTH = 900;

/**
 * 将一组顶层语法项按宽度切分为多行，超长时每行单独成行（最终合并进同一张图）：
 * - 只有一行：使用普通 Diagram（正常的起止符）
 * - 多于一行：每行使用 ComplexDiagram（双线起止符，表示该行是更大语句的一部分，
 *   各行从上到下堆叠阅读，等价于续行）；这些行会在 mergeRowsToSVG 中合并为一张图。
 */
function wrapToRows(items, maxWidth = MAX_ROW_WIDTH) {
  const rows = [];
  let current = [];
  let currentWidth = 0;
  for (const item of items) {
    const itemWidth = item.width + (item.needsSpace ? 20 : 0);
    if (current.length > 0 && currentWidth + itemWidth > maxWidth) {
      rows.push(current);
      current = [];
      currentWidth = 0;
    }
    current.push(item);
    currentWidth += itemWidth;
  }
  if (current.length > 0) rows.push(current);

  if (rows.length <= 1) {
    return [Diagram(...items)];
  }
  return rows.map((row) => ComplexDiagram(...row));
}

const D = (t) => Sequence(Terminal(t), Comment('默认'));

// 介质类型：DISK（默认）| TAPE，多个命令复用
const deviceTypeChoice = () => Choice(0, D('DISK'), Terminal('TAPE'));

// <device_type_stmt>::= DEVICE TYPE <介质类型> [PARMS '<介质参数>']
const deviceTypeStmtItems = () => [
  Terminal('DEVICE'),
  Terminal('TYPE'),
  deviceTypeChoice(),
  Optional(Sequence(Terminal('PARMS'), NonTerminal('介质参数'))),
];

// <database_bakdir_lst_stmt>::= DATABASE '<INI_PATH>' | WITH BACKUPDIR ... | DATABASE ... WITH BACKUPDIR ...
const databaseBakdirLstStmtItems = () => [
  Choice(
    0,
    Sequence(Terminal('DATABASE'), NonTerminal('INI_PATH')),
    Sequence(
      Terminal('WITH'),
      Terminal('BACKUPDIR'),
      OneOrMore(NonTerminal('备份集搜索目录'), Terminal(',')),
    ),
    Sequence(
      Terminal('DATABASE'),
      NonTerminal('INI_PATH'),
      Terminal('WITH'),
      Terminal('BACKUPDIR'),
      OneOrMore(NonTerminal('备份集搜索目录'), Terminal(',')),
    ),
  ),
];

// <from_clause>::= FROM BACKUPSET '<备份集路径>' | FROM BACKUPNAME <备份名>
const fromClauseItems = () => [
  Choice(
    0,
    Sequence(
      Terminal('FROM'),
      Terminal('BACKUPSET'),
      NonTerminal('备份集路径'),
    ),
    Sequence(Terminal('FROM'), Terminal('BACKUPNAME'), NonTerminal('备份名')),
  ),
];

/**
 * ENTRIES: 每项 { file, sections: [{ name, label, items }] }
 * label 为 null 时不额外渲染标题（即整条命令的主语法图）。
 * items 是顶层语法项数组，由 wrapToRows 自动按宽度拆行、生成一张或多张图。
 */
const ENTRIES = [
  // ---------------- configure ----------------
  {
    file: 'configure',
    sections: [
      {
        name: 'main',
        label: null,
        items: [
          Choice(
            0,
            Terminal('CONFIGURE'),
            Sequence(Terminal('CONFIGURE'), Terminal('CLEAR')),
            Sequence(
              Terminal('CONFIGURE'),
              Terminal('DEFAULT'),
              NonTerminal('sub_conf_stmt'),
            ),
          ),
        ],
      },
      {
        name: 'sub-conf-stmt',
        label: '`<sub_conf_stmt>`',
        items: [
          Choice(
            0,
            Sequence(
              Terminal('DEVICE'),
              Optional(
                Choice(
                  0,
                  Sequence(
                    Terminal('TYPE'),
                    NonTerminal('介质类型'),
                    Optional(
                      Sequence(Terminal('PARMS'), NonTerminal('介质参数')),
                    ),
                  ),
                  Terminal('CLEAR'),
                ),
              ),
            ),
            Sequence(
              Terminal('TRACE'),
              Optional(
                Choice(
                  0,
                  Sequence(
                    Optional(
                      Sequence(
                        Terminal('FILE'),
                        NonTerminal('跟踪日志文件路径'),
                      ),
                    ),
                    Optional(
                      Sequence(
                        Terminal('TRACE'),
                        Terminal('LEVEL'),
                        NonTerminal('跟踪日志等级'),
                      ),
                    ),
                  ),
                  Terminal('CLEAR'),
                ),
              ),
            ),
            Sequence(
              Terminal('BACKUPDIR'),
              Optional(
                Choice(
                  0,
                  Sequence(
                    Choice(0, D('ADD'), Terminal('DELETE')),
                    OneOrMore(NonTerminal('基备份搜索目录'), Terminal(',')),
                  ),
                  Terminal('CLEAR'),
                ),
              ),
            ),
            Sequence(
              Terminal('ARCHIVEDIR'),
              Optional(
                Choice(
                  0,
                  Sequence(
                    Choice(0, D('ADD'), Terminal('DELETE')),
                    OneOrMore(NonTerminal('归档日志目录'), Terminal(',')),
                  ),
                  Terminal('CLEAR'),
                ),
              ),
            ),
            Sequence(
              Terminal('OPEN'),
              Terminal('FILES'),
              Optional(
                Choice(0, NonTerminal('文件句柄个数'), Terminal('CLEAR')),
              ),
            ),
          ),
        ],
      },
    ],
  },

  // ---------------- backup-database ----------------
  {
    file: 'backup-database',
    sections: [
      {
        name: 'main',
        label: null,
        items: [
          Terminal('BACKUP'),
          Terminal('DATABASE'),
          NonTerminal('INI文件路径'),
          Optional(NonTerminal('备份类型')),
          Optional(NonTerminal('指定备份集子句')),
          Optional(
            Sequence(
              Choice(0, Terminal('TO'), Terminal('BACKUPNAME')),
              NonTerminal('备份名'),
            ),
          ),
          Optional(NonTerminal('备份集路径子句')),
          Optional(
            Sequence(
              Terminal('DEVICE'),
              Terminal('TYPE'),
              deviceTypeChoice(),
              Optional(Sequence(Terminal('PARMS'), NonTerminal('介质参数'))),
            ),
          ),
          Optional(Sequence(Terminal('BACKUPINFO'), NonTerminal('备份描述'))),
          Optional(
            Sequence(Terminal('MAXPIECESIZE'), NonTerminal('备份片限制大小')),
          ),
          Optional(
            Sequence(
              Terminal('LIMIT'),
              Choice(0, NonTerminal('read_limit'), NonTerminal('write_limit')),
            ),
          ),
          Optional(
            Sequence(
              Terminal('IDENTIFIED'),
              Terminal('BY'),
              NonTerminal('密码'),
              Optional(
                Sequence(
                  Terminal('WITH'),
                  Terminal('ENCRYPTION'),
                  NonTerminal('加密类型'),
                ),
              ),
              Optional(
                Sequence(
                  Terminal('ENCRYPT'),
                  Terminal('WITH'),
                  NonTerminal('加密算法'),
                ),
              ),
            ),
          ),
          Optional(
            Sequence(
              Terminal('COMPRESSED'),
              Optional(Sequence(Terminal('LEVEL'), NonTerminal('压缩级别'))),
            ),
          ),
          Optional(Sequence(Terminal('WITHOUT'), Terminal('LOG'))),
          Optional(Sequence(Terminal('WITHOUT'), Terminal('MIRROR'))),
          Optional(
            Sequence(
              Terminal('TASK'),
              Terminal('THREAD'),
              NonTerminal('线程数'),
            ),
          ),
          Optional(
            Sequence(
              Terminal('PARALLEL'),
              Optional(NonTerminal('并行数')),
              Optional(
                Sequence(
                  Terminal('READ'),
                  Terminal('SIZE'),
                  NonTerminal('拆分块大小'),
                ),
              ),
            ),
          ),
          Optional(
            Sequence(
              Terminal('USE'),
              Terminal('BAK_MAGIC'),
              NonTerminal('DPC备份集魔数'),
            ),
          ),
        ],
      },
    ],
  },

  // ---------------- backupset ----------------
  {
    file: 'backupset',
    sections: [
      {
        name: 'show-backupset',
        label: 'SHOW BACKUPSET（单个备份集）',
        items: [
          Terminal('SHOW'),
          Terminal('BACKUPSET'),
          NonTerminal('备份集目录'),
          Optional(NonTerminal('device_type_stmt')),
          Optional(Terminal('RECURSIVE')),
          Optional(NonTerminal('database_bakdir_lst_stmt')),
          Optional(NonTerminal('info_type_stmt')),
          Optional(NonTerminal('to_file_stmt')),
        ],
      },
      {
        name: 'show-backupsets',
        label: 'SHOW BACKUPSETS（批量）',
        items: [
          Terminal('SHOW'),
          Terminal('BACKUPSETS'),
          Optional(NonTerminal('device_type_stmt')),
          NonTerminal('database_bakdir_lst_stmt'),
          Optional(NonTerminal('info_type_stmt')),
          Optional(NonTerminal('use_db_magic_stmt')),
          Optional(NonTerminal('to_file_stmt')),
        ],
      },
      {
        name: 'device-type-stmt',
        label: '`<device_type_stmt>`',
        items: deviceTypeStmtItems(),
      },
      {
        name: 'database-bakdir-lst-stmt',
        label: '`<database_bakdir_lst_stmt>`',
        items: databaseBakdirLstStmtItems(),
      },
      {
        name: 'info-type-stmt',
        label: '`<info_type_stmt>`',
        items: [Terminal('INFO'), NonTerminal('信息类型')],
      },
      {
        name: 'use-db-magic-stmt',
        label: '`<use_db_magic_stmt>`',
        items: [Terminal('USE'), Terminal('DB_MAGIC'), NonTerminal('db_magic')],
      },
      {
        name: 'to-file-stmt',
        label: '`<to_file_stmt>`',
        items: [
          Terminal('TO'),
          NonTerminal('输出文件路径'),
          Optional(
            Sequence(Terminal('FORMAT'), Choice(0, D('TXT'), Terminal('XML'))),
          ),
        ],
      },
    ],
  },

  // ---------------- check-backupset ----------------
  {
    file: 'check-backupset',
    sections: [
      {
        name: 'main',
        label: null,
        items: [
          Terminal('CHECK'),
          Terminal('BACKUPSET'),
          NonTerminal('备份集目录'),
          Optional(
            Sequence(
              Terminal('DEVICE'),
              Terminal('TYPE'),
              deviceTypeChoice(),
              Optional(Sequence(Terminal('PARMS'), NonTerminal('介质参数'))),
            ),
          ),
          Optional(Sequence(Terminal('DATABASE'), NonTerminal('INI_PATH'))),
          Optional(
            Sequence(
              Terminal('IDENTIFIED'),
              Terminal('BY'),
              NonTerminal('备份密码'),
              Optional(
                Sequence(
                  Terminal('ENCRYPT'),
                  Terminal('WITH'),
                  NonTerminal('备份加密算法名称'),
                ),
              ),
            ),
          ),
          Optional(Sequence(Terminal('LEVEL'), NonTerminal('校验级别'))),
        ],
      },
    ],
  },

  // ---------------- remove-backupset ----------------
  {
    file: 'remove-backupset',
    sections: [
      {
        name: 'remove-backupset',
        label: 'REMOVE BACKUPSET（单个备份集）',
        items: [
          Terminal('REMOVE'),
          Terminal('BACKUPSET'),
          NonTerminal('备份集目录'),
          Optional(NonTerminal('device_type_stmt')),
          Optional(NonTerminal('database_bakdir_lst_stmt')),
          Optional(Terminal('CASCADE')),
        ],
      },
      {
        name: 'remove-backupsets',
        label: 'REMOVE BACKUPSETS（批量）',
        items: [
          Terminal('REMOVE'),
          Optional(NonTerminal('备份集类型')),
          Terminal('BACKUPSETS'),
          Optional(NonTerminal('device_type_stmt')),
          NonTerminal('database_bakdir_lst_stmt'),
          Optional(
            Choice(
              0,
              Sequence(
                Terminal('UNTIL'),
                Terminal('TIME'),
                NonTerminal('截止时间串'),
              ),
              Sequence(Terminal('BEFORE'), NonTerminal('n_day')),
            ),
          ),
        ],
      },
      {
        name: 'device-type-stmt',
        label: '`<device_type_stmt>`',
        items: deviceTypeStmtItems(),
      },
      {
        name: 'database-bakdir-lst-stmt',
        label: '`<database_bakdir_lst_stmt>`',
        items: databaseBakdirLstStmtItems(),
      },
      {
        name: 'backupset-type',
        label: '`<备份集类型>`',
        items: [
          Choice(
            0,
            Terminal('DATABASE'),
            Sequence(Terminal('TABLESPACE'), Optional(NonTerminal('ts_name'))),
            Sequence(
              Terminal('TABLE'),
              Optional(
                Sequence(
                  NonTerminal('schema_name'),
                  Terminal('.'),
                  NonTerminal('tab_name'),
                ),
              ),
            ),
            Terminal('ARCHIVELOG'),
            Sequence(Terminal('ARCHIVE'), Terminal('LOG')),
          ),
        ],
      },
    ],
  },

  // ---------------- merge-database ----------------
  {
    file: 'merge-database',
    sections: [
      {
        name: 'main',
        label: null,
        items: [
          Terminal('MERGE'),
          Terminal('DATABASE'),
          NonTerminal('ini_path'),
          Optional(Sequence(Terminal('WITH'), Terminal('CHECK'))),
          Optional(Sequence(Terminal('WITHOUT'), Terminal('SPACE'))),
          Optional(Sequence(Terminal('AUTO'), Terminal('EXTEND'))),
          Optional(Terminal('OVERWRITE')),
          Terminal('FROM'),
          Terminal('BACKUPSET'),
          NonTerminal('备份集路径'),
          Optional(NonTerminal('device_type_stmt')),
          Optional(
            Sequence(
              Terminal('IDENTIFIED'),
              Terminal('BY'),
              NonTerminal('密码'),
              Optional(
                Sequence(
                  Terminal('ENCRYPT'),
                  Terminal('WITH'),
                  NonTerminal('加密算法'),
                ),
              ),
            ),
          ),
          Optional(
            Sequence(
              Terminal('WITH'),
              Terminal('BACKUPDIR'),
              OneOrMore(NonTerminal('基备份搜索目录'), Terminal(',')),
            ),
          ),
          Optional(
            Sequence(
              Terminal('TASK'),
              Terminal('THREAD'),
              NonTerminal('任务线程数'),
            ),
          ),
          Optional(
            Sequence(
              Terminal('RENAME'),
              Terminal('TO'),
              NonTerminal('数据库名'),
            ),
          ),
          Optional(
            Sequence(
              Terminal('USE'),
              Terminal('BAK_MAGIC'),
              NonTerminal('DPC备份集魔数'),
            ),
          ),
          Optional(Sequence(Terminal('IGNORE'), Terminal('CORRUPT'))),
          Optional(Sequence(Terminal('AUTO'), Terminal('CLEAR'))),
        ],
      },
      {
        name: 'device-type-stmt',
        label: '`<device_type_stmt>`',
        items: deviceTypeStmtItems(),
      },
    ],
  },

  // ---------------- restore-database ----------------
  {
    file: 'restore-database',
    sections: [
      {
        name: 'main',
        label: null,
        items: [
          Terminal('RESTORE'),
          Terminal('DATABASE'),
          NonTerminal('restore_type'),
          NonTerminal('from_clause'),
          Optional(NonTerminal('device_type_stmt')),
          Optional(
            Sequence(
              Terminal('IDENTIFIED'),
              Terminal('BY'),
              NonTerminal('密码'),
              Optional(
                Sequence(
                  Terminal('ENCRYPT'),
                  Terminal('WITH'),
                  NonTerminal('加密算法'),
                ),
              ),
            ),
          ),
          Optional(
            Sequence(
              Terminal('WITH'),
              Terminal('BACKUPDIR'),
              OneOrMore(NonTerminal('基备份搜索目录'), Terminal(',')),
            ),
          ),
          Optional(
            Sequence(
              Terminal('MAPPED'),
              Terminal('FILE'),
              NonTerminal('映射文件路径'),
            ),
          ),
          Optional(
            Sequence(
              Terminal('TASK'),
              Terminal('THREAD'),
              NonTerminal('任务线程数'),
            ),
          ),
          Optional(
            Sequence(
              Terminal('RENAME'),
              Terminal('TO'),
              NonTerminal('数据库名'),
            ),
          ),
          Optional(
            Sequence(
              Terminal('USE'),
              Terminal('BAK_MAGIC'),
              NonTerminal('DPC备份集魔数'),
            ),
          ),
          Optional(Sequence(Terminal('IGNORE'), Terminal('CORRUPT'))),
          Optional(Terminal('AUTO_CLEAR')),
        ],
      },
      {
        name: 'restore-type',
        label: '`<restore_type>`',
        items: [Choice(0, NonTerminal('type1'), NonTerminal('type2'))],
      },
      {
        name: 'type1',
        label: '`<type1>`',
        items: [
          NonTerminal('ini_path'),
          Optional(Sequence(Terminal('TO'), Terminal('SHADOW'))),
          Optional(Sequence(Terminal('WITH'), Terminal('CHECK'))),
          Optional(Sequence(Terminal('REUSE'), Terminal('DMINI'))),
          Optional(Sequence(Terminal('WITHOUT'), Terminal('SPACE'))),
          Optional(Sequence(Terminal('WITHOUT'), Terminal('MIRROR'))),
          Optional(Sequence(Terminal('AUTO'), Terminal('EXTEND'))),
          Optional(Terminal('OVERWRITE')),
        ],
      },
      {
        name: 'type2',
        label: '`<type2>`',
        items: [
          Terminal('TO'),
          NonTerminal('system_dbf_dir'),
          Optional(Sequence(Terminal('TO'), Terminal('SHADOW'))),
          Optional(Sequence(Terminal('WITH'), Terminal('CHECK'))),
          Optional(Terminal('OVERWRITE')),
          Optional(Sequence(Terminal('WITHOUT'), Terminal('MIRROR'))),
        ],
      },
      {
        name: 'from-clause',
        label: '`<from_clause>`',
        items: fromClauseItems(),
      },
      {
        name: 'device-type-stmt',
        label: '`<device_type_stmt>`',
        items: deviceTypeStmtItems(),
      },
    ],
  },

  // ---------------- recover-database ----------------
  {
    file: 'recover-database',
    sections: [
      {
        name: 'recover-consistency',
        label: '恢复一致性（从归档恢复）',
        items: [
          Terminal('RECOVER'),
          Terminal('DATABASE'),
          NonTerminal('ini_path'),
          Optional(Sequence(Terminal('FOR'), Terminal('STANDBY'))),
          Terminal('WITH'),
          Terminal('ARCHIVEDIR'),
          OneOrMore(NonTerminal('归档日志目录'), Terminal(',')),
          Optional(
            Sequence(
              Terminal('USE'),
              Terminal('DB_MAGIC'),
              NonTerminal('db_magic'),
            ),
          ),
          Optional(
            Sequence(
              Terminal('UNTIL'),
              Terminal('TIME'),
              NonTerminal('时间串'),
            ),
          ),
          Optional(
            Sequence(Terminal('UNTIL'), Terminal('LSN'), NonTerminal('LSN')),
          ),
        ],
      },
      {
        name: 'recover-from-backupset',
        label: '从备份集恢复',
        items: [
          Terminal('RECOVER'),
          Terminal('DATABASE'),
          NonTerminal('ini_path'),
          Optional(Sequence(Terminal('FOR'), Terminal('STANDBY'))),
          NonTerminal('from_clause'),
          Optional(NonTerminal('device_type_stmt')),
          Optional(
            Sequence(
              Terminal('IDENTIFIED'),
              Terminal('BY'),
              NonTerminal('密码'),
              Optional(
                Sequence(
                  Terminal('ENCRYPT'),
                  Terminal('WITH'),
                  NonTerminal('加密算法'),
                ),
              ),
            ),
          ),
          Optional(
            Sequence(
              Terminal('USE'),
              Terminal('BAK_MAGIC'),
              NonTerminal('DPC备份集魔数'),
            ),
          ),
          Optional(Sequence(Terminal('UNTIL'), Terminal('END_LSN'))),
        ],
      },
      {
        name: 'from-clause',
        label: '`<from_clause>`',
        items: fromClauseItems(),
      },
      {
        name: 'device-type-stmt',
        label: '`<device_type_stmt>`',
        items: deviceTypeStmtItems(),
      },
    ],
  },

  // ---------------- restore-tablespace ----------------
  {
    file: 'restore-tablespace',
    sections: [
      {
        name: 'main',
        label: null,
        items: [
          Terminal('RESTORE'),
          Terminal('DATABASE'),
          NonTerminal('ini_path'),
          Terminal('TABLESPACE'),
          NonTerminal('表空间名'),
          Optional(Sequence(Terminal('WITH'), Terminal('CHECK'))),
          Optional(
            Choice(
              0,
              Sequence(
                Terminal('DATAFILE'),
                OneOrMore(NonTerminal('文件编号'), Terminal(',')),
              ),
              OneOrMore(NonTerminal('文件路径'), Terminal(',')),
            ),
          ),
          NonTerminal('from_clause'),
          Optional(NonTerminal('device_type_stmt')),
          Optional(
            Sequence(
              Terminal('IDENTIFIED'),
              Terminal('BY'),
              NonTerminal('密码'),
            ),
          ),
          Optional(
            Sequence(
              Terminal('ENCRYPT'),
              Terminal('WITH'),
              NonTerminal('加密算法'),
            ),
          ),
          Optional(
            Sequence(
              Terminal('WITH'),
              Terminal('BACKUPDIR'),
              OneOrMore(NonTerminal('基备份搜索目录'), Terminal(',')),
            ),
          ),
          Optional(
            Sequence(
              Terminal('MAPPED'),
              Terminal('FILE'),
              NonTerminal('映射文件路径'),
            ),
          ),
          Optional(
            Sequence(
              Terminal('TASK'),
              Terminal('THREAD'),
              NonTerminal('线程数'),
            ),
          ),
          Optional(Sequence(Terminal('IGNORE'), Terminal('CORRUPT'))),
          Optional(Sequence(Terminal('AUTO'), Terminal('CLEAR'))),
        ],
      },
      {
        name: 'from-clause',
        label: '`<from_clause>`',
        items: fromClauseItems(),
      },
      {
        name: 'device-type-stmt',
        label: '`<device_type_stmt>`',
        items: deviceTypeStmtItems(),
      },
    ],
  },

  // ---------------- recover-tablespace ----------------
  {
    file: 'recover-tablespace',
    sections: [
      {
        name: 'main',
        label: null,
        items: [
          Terminal('RECOVER'),
          Terminal('DATABASE'),
          NonTerminal('ini_path'),
          Terminal('TABLESPACE'),
          NonTerminal('表空间名'),
          Optional(
            Sequence(
              Terminal('WITH'),
              Terminal('ARCHIVEDIR'),
              OneOrMore(NonTerminal('归档日志目录'), Terminal(',')),
            ),
          ),
          Optional(
            Sequence(
              Terminal('USE'),
              Terminal('DB_MAGIC'),
              NonTerminal('db_magic'),
            ),
          ),
          Optional(
            Sequence(
              Terminal('UNTIL'),
              Terminal('TIME'),
              NonTerminal('时间串'),
            ),
          ),
          Optional(
            Sequence(Terminal('UNTIL'), Terminal('LSN'), NonTerminal('lsn')),
          ),
        ],
      },
    ],
  },

  // ---------------- restore-archive-log ----------------
  {
    file: 'restore-archive-log',
    sections: [
      {
        name: 'main',
        label: null,
        items: [
          Terminal('RESTORE'),
          Choice(
            0,
            Sequence(Terminal('ARCHIVE'), Terminal('LOG')),
            Terminal('ARCHIVELOG'),
          ),
          Optional(Sequence(Terminal('WITH'), Terminal('CHECK'))),
          NonTerminal('from_clause'),
          Optional(NonTerminal('device_type_stmt')),
          Optional(
            Sequence(
              Terminal('IDENTIFIED'),
              Terminal('BY'),
              NonTerminal('密码'),
              Optional(
                Sequence(
                  Terminal('ENCRYPT'),
                  Terminal('WITH'),
                  NonTerminal('加密算法'),
                ),
              ),
            ),
          ),
          Optional(
            Sequence(
              Terminal('TASK'),
              Terminal('THREAD'),
              NonTerminal('任务线程数'),
            ),
          ),
          Optional(
            Choice(
              0,
              Terminal('ALL'),
              Sequence(Terminal('FROM'), Terminal('LSN'), NonTerminal('lsn')),
              Sequence(Terminal('UNTIL'), Terminal('LSN'), NonTerminal('lsn')),
              Sequence(
                Terminal('LSN'),
                Terminal('BETWEEN'),
                NonTerminal('lsn'),
                Terminal('AND'),
                NonTerminal('lsn'),
              ),
              Sequence(Terminal('FROM'), Terminal('TIME'), NonTerminal('time')),
              Sequence(
                Terminal('UNTIL'),
                Terminal('TIME'),
                NonTerminal('time'),
              ),
              Sequence(
                Terminal('TIME'),
                Terminal('BETWEEN'),
                NonTerminal('time'),
                Terminal('AND'),
                NonTerminal('time'),
              ),
            ),
          ),
          Terminal('TO'),
          NonTerminal('还原目录'),
          Optional(Sequence(Terminal('OVERWRITE'), NonTerminal('level'))),
        ],
      },
      {
        name: 'from-clause',
        label: '`<from_clause>`',
        items: fromClauseItems(),
      },
      {
        name: 'device-type-stmt',
        label: '`<device_type_stmt>`',
        items: deviceTypeStmtItems(),
      },
      {
        name: 'target-dir',
        label: '`<还原目录>`',
        items: [
          Choice(
            0,
            Sequence(Terminal('ARCHIVEDIR'), NonTerminal('归档日志目录')),
            Sequence(Terminal('DATABASE'), NonTerminal('ini_path')),
          ),
        ],
      },
    ],
  },

  // ---------------- repair-archive ----------------
  {
    file: 'repair-archive',
    sections: [
      {
        name: 'main',
        label: null,
        items: [
          Terminal('REPAIR'),
          Choice(
            0,
            Sequence(Terminal('ARCHIVE'), Terminal('LOG')),
            Terminal('ARCHIVELOG'),
          ),
          Terminal('DATABASE'),
          NonTerminal('ini_path'),
        ],
      },
    ],
  },
];

const DOCS_DIR = join(__dirname, '../docs/v8/rman');
const COMMANDS_DIR = join(DOCS_DIR, 'commands');

let updatedCount = 0;

for (const entry of ENTRIES) {
  const isConfigure = entry.file === 'configure';
  const mdDir = isConfigure ? DOCS_DIR : COMMANDS_DIR;
  const railroadDir = join(mdDir, 'railroad', entry.file);
  mkdirSync(railroadDir, { recursive: true });

  const mdPath = join(mdDir, `${entry.file}.md`);
  let md = readFileSync(mdPath, 'utf8');

  let replacement = isConfigure ? '语法如下：\n\n' : '## 语法\n\n';
  for (const section of entry.sections) {
    const rows = wrapToRows(section.items);
    const svgName = `${section.name}.svg`;
    writeFileSync(join(railroadDir, svgName), mergeRowsToSVG(rows), 'utf8');
    const imgRef = `![语法图](./railroad/${entry.file}/${svgName})`;

    if (section.label) {
      replacement += `${section.label}\n\n${imgRef}\n\n`;
    } else {
      replacement += `${imgRef}\n\n`;
    }
  }
  replacement = replacement.trimEnd() + '\n';

  {
    const lines = md.split('\n');
    const startIdx = isConfigure
      ? lines.findIndex((l) => l.trim() === '语法如下：')
      : lines.findIndex((l) => l.trim() === '## 语法');
    if (startIdx === -1) {
      console.warn(
        `⚠️  ${entry.file}.md: 未找到${isConfigure ? '"语法如下："' : '"## 语法"'} 标题，跳过`,
      );
      continue;
    }
    let endIdx = lines.length;
    for (let i = startIdx + 1; i < lines.length; i++) {
      if (lines[i].startsWith('## ')) {
        endIdx = i;
        break;
      }
    }
    const newLines = [
      ...lines.slice(0, startIdx),
      ...replacement.split('\n'),
      ...lines.slice(endIdx),
    ];
    md = newLines.join('\n').replace(/\n{3,}/g, '\n\n');
  }

  writeFileSync(mdPath, md, 'utf8');
  updatedCount++;
  const rowCounts = entry.sections.map((s) => wrapToRows(s.items).length);
  console.log(
    `✓  ${entry.file} (${entry.sections.length} 个图，行数: ${rowCounts.join(',')})`,
  );
}

console.log(`\n完成：处理 ${updatedCount} 个文档`);
