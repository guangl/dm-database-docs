/**
 * 生成所有环境变量文档的铁路图（SVG）并更新对应 .md 文件。
 *
 * 规范：
 * - Choice(defaultIndex, ...items): defaultIndex 指向的选项走直通路径，表示默认值
 * - 颜色：SVG 内嵌 prefers-color-scheme，浅色/深色模式均可正常显示
 */

import { createRequire } from 'module';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const rr = require('railroad-diagrams');

const { Diagram, Sequence, Choice, Optional, Terminal, NonTerminal, Comment } = rr;

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

// 带默认标注的选项组 —— Comment('默认') 紧跟默认选项，明确可见
const D = (t) => Sequence(Terminal(t), Comment('默认'));  // 带标注的默认终结符

const ON_OFF_DEFAULT_ON  = () => Choice(0, D('ON'),  Terminal('OFF'));
const ON_OFF_DEFAULT_OFF = () => Choice(1, Terminal('ON'), D('OFF'));
const ENCODING = () =>
  Choice(3, Terminal('GBK'), Terminal('GB18030'), Terminal('UTF8'), D('DEFAULT'));

/**
 * 每项 { file, diagram }
 *
 * Choice(defaultIndex, ...items) 中，defaultIndex 对应项走水平直通路径，即默认值。
 * 铁路图惯例：直通路径 = 默认路径。
 */
const ENTRIES = [
  {
    // 默认 OFF
    file: 'auto',
    diagram: Diagram(
      Terminal('SET'),
      Sequence(Terminal('AUTO'), Optional(Terminal('COMMIT'))),
      ON_OFF_DEFAULT_OFF(),
    ),
  },
  {
    // 默认 OFF
    file: 'autoreconn',
    diagram: Diagram(Terminal('SET'), Terminal('AUTORECONN'), ON_OFF_DEFAULT_OFF()),
  },
  {
    // 默认 OFF
    file: 'autotrace',
    diagram: Diagram(
      Terminal('SET'),
      Terminal('AUTOTRACE'),
      Choice(0, D('OFF'), Terminal('NL'), Terminal('INDEX'), Terminal('ON'), Terminal('TRACE'), Terminal('TRACEONLY')),
    ),
  },
  {
    // 默认 DEFAULT
    file: 'char_code',
    diagram: Diagram(Terminal('SET'), Terminal('CHAR_CODE'), ENCODING()),
  },
  {
    file: 'chardel',
    diagram: Diagram(Terminal('SET'), Terminal('CHARDEL'), NonTerminal('text')),
  },
  {
    // 默认 ON
    file: 'cmd_exec',
    diagram: Diagram(Terminal('SET'), Terminal('CMD_EXEC'), ON_OFF_DEFAULT_ON()),
  },
  {
    file: 'colsep',
    diagram: Diagram(Terminal('SET'), Terminal('COLSEP'), NonTerminal('text')),
  },
  {
    // 默认 ON
    file: 'console_print',
    diagram: Diagram(
      Terminal('SET'),
      Terminal('CONSOLE_PRINT'),
      Choice(0, D('ON'), Terminal('OFF'), Terminal('OFF_WITH_TIME'), Terminal('OFF_WITH_FEEDBACK')),
    ),
  },
  {
    // 默认 0
    file: 'ctrl_info',
    diagram: Diagram(
      Terminal('SET'),
      Terminal('CTRL_INFO'),
      Choice(0, D('0'), NonTerminal('n')),
    ),
  },
  {
    // 默认 FORWARDONLY
    file: 'cursor',
    diagram: Diagram(
      Terminal('SET'),
      Terminal('CURSOR'),
      Choice(1, Terminal('STATIC'), D('FORWARDONLY')),
    ),
  },
  {
    // 默认 ON（使用 & 前缀）
    file: 'define',
    diagram: Diagram(
      Terminal('SET'),
      Terminal('DEFINE'),
      Choice(1, NonTerminal('c'), D('ON'), Terminal('OFF')),
    ),
  },
  {
    file: 'describe',
    diagram: Diagram(
      Terminal('SET'),
      Terminal('DESCRIBE'),
      Optional(Sequence(Terminal('DEPTH'), Choice(0, NonTerminal('n'), Terminal('ALL')))),
      Optional(Sequence(Terminal('LINENUM'), ON_OFF_DEFAULT_ON())),
      Optional(Sequence(Terminal('INDENT'), ON_OFF_DEFAULT_OFF())),
    ),
  },
  {
    // 默认 OFF
    file: 'echo',
    diagram: Diagram(Terminal('SET'), Terminal('ECHO'), ON_OFF_DEFAULT_OFF()),
  },
  {
    // 默认 OFF
    file: 'err_fmt',
    diagram: Diagram(Terminal('SET'), Terminal('ERR_FMT'), ON_OFF_DEFAULT_OFF()),
  },
  {
    // 默认 0（正常执行）
    file: 'explain_mode',
    diagram: Diagram(
      Terminal('SET'),
      Terminal('EXPLAIN_MODE'),
      Choice(0, D('0'), Terminal('1'), Terminal('2')),
    ),
  },
  {
    // 默认 ON（缺省值 n=6）
    file: 'feed',
    diagram: Diagram(
      Terminal('SET'),
      Sequence(Terminal('FEED'), Optional(Terminal('BACK'))),
      Choice(1, NonTerminal('n'), D('ON'), Terminal('OFF')),
    ),
  },
  {
    file: 'float_show',
    diagram: Diagram(
      Terminal('SET'),
      Terminal('FLOAT_SHOW'),
      Choice(0, NonTerminal('float_length'), Terminal('0')),
    ),
  },
  {
    // 默认 ON（默认显示列标题）；HEA 单独处理，避免与 ON_OFF_DEFAULT_ON 混淆
    file: 'hea',
    diagram: Diagram(
      Terminal('SET'),
      Sequence(Terminal('HEA'), Optional(Terminal('DING'))),
      ON_OFF_DEFAULT_ON(),
    ),
  },
  {
    // 默认 0（DM 原生模式）
    file: 'isql_mode',
    diagram: Diagram(
      Terminal('SET'),
      Terminal('ISQL_MODE'),
      Choice(0, D('0'), Terminal('1'), Terminal('2'), Terminal('3')),
    ),
  },
  {
    // 默认 OFF（默认进行对齐优化）
    file: 'keepdata',
    diagram: Diagram(Terminal('SET'), Terminal('KEEPDATA'), ON_OFF_DEFAULT_OFF()),
  },
  {
    // 默认 OFF
    file: 'lineshow',
    diagram: Diagram(Terminal('SET'), Terminal('LINESHOW'), ON_OFF_DEFAULT_OFF()),
  },
  {
    file: 'linesize',
    diagram: Diagram(Terminal('SET'), Terminal('LINESIZE'), NonTerminal('n')),
  },
  {
    // 默认 OFF
    file: 'lobcomplete',
    diagram: Diagram(Terminal('SET'), Terminal('LOBCOMPLETE'), ON_OFF_DEFAULT_OFF()),
  },
  {
    // 默认 DEFAULT
    file: 'local_code',
    diagram: Diagram(Terminal('SET'), Terminal('LOCAL_CODE'), ENCODING()),
  },
  {
    file: 'long',
    diagram: Diagram(Terminal('SET'), Terminal('LONG'), NonTerminal('n')),
  },
  {
    // 默认 OFF
    file: 'nest_comment',
    diagram: Diagram(Terminal('SET'), Terminal('NEST_COMMENT'), ON_OFF_DEFAULT_OFF()),
  },
  {
    // 默认 n=1
    file: 'newp',
    diagram: Diagram(
      Terminal('SET'),
      Sequence(Terminal('NEWP'), Optional(Terminal('AGE'))),
      Choice(1, Terminal('0'), D('n'), Terminal('NONE')),
    ),
  },
  {
    // 默认 OFF
    file: 'null_asnull',
    diagram: Diagram(Terminal('SET'), Terminal('NULL_ASNULL'), ON_OFF_DEFAULT_OFF()),
  },
  {
    // 默认 OFF
    file: 'null_show',
    diagram: Diagram(Terminal('SET'), Terminal('NULL_SHOW'), ON_OFF_DEFAULT_OFF()),
  },
  {
    file: 'pages',
    diagram: Diagram(
      Terminal('SET'),
      Sequence(Terminal('PAGES'), Optional(Terminal('IZE'))),
      NonTerminal('n'),
    ),
  },
  {
    file: 'prefix_str',
    diagram: Diagram(Terminal('SET'), Terminal('PREFIX_STR'), NonTerminal('text')),
  },
  {
    // 默认 OFF
    file: 'read_only',
    diagram: Diagram(Terminal('SET'), Terminal('READ_ONLY'), ON_OFF_DEFAULT_OFF()),
  },
  {
    // 默认 3
    file: 'retry_conn',
    diagram: Diagram(
      Terminal('SET'),
      Terminal('RETRY_CONN'),
      Choice(0, D('3'), NonTerminal('n'), Terminal('0')),
    ),
  },
  {
    // 默认 0（无间隔）
    file: 'retry_conn_time',
    diagram: Diagram(
      Terminal('SET'),
      Terminal('RETRY_CONN_TIME'),
      Choice(0, D('0'), NonTerminal('n')),
    ),
  },
  {
    // 默认 0（不限制）
    file: 'rows',
    diagram: Diagram(
      Terminal('SET'),
      Terminal('ROWS'),
      Choice(0, D('0'), NonTerminal('n')),
    ),
  },
  {
    file: 'screenbufsize',
    diagram: Diagram(Terminal('SET'), Terminal('SCREENBUFSIZE'), NonTerminal('n')),
  },
  {
    // 默认 OFF
    file: 'serverout',
    diagram: Diagram(
      Terminal('SET'),
      Sequence(Terminal('SERVEROUT'), Optional(Terminal('PUT'))),
      ON_OFF_DEFAULT_OFF(),
      Optional(Sequence(Terminal('SIZE'), NonTerminal('n'))),
      Optional(Choice(0, Terminal('WORD_WRAPPED'), Terminal('TRUNCATED'), Terminal('FORMAT'))),
    ),
  },
  {
    // 默认 OFF
    file: 'sql_lineshow',
    diagram: Diagram(Terminal('SET'), Terminal('SQL_LINESHOW'), ON_OFF_DEFAULT_OFF()),
  },
  {
    // 默认 OFF
    file: 'sqlcode',
    diagram: Diagram(Terminal('SET'), Terminal('SQLCODE'), ON_OFF_DEFAULT_OFF()),
  },
  {
    file: 'sqlp',
    diagram: Diagram(
      Terminal('SET'),
      Sequence(Terminal('SQLP'), Optional(Terminal('ROMPT'))),
      NonTerminal('text'),
    ),
  },
  {
    // 默认 OFF
    file: 'time',
    diagram: Diagram(Terminal('SET'), Terminal('TIME'), ON_OFF_DEFAULT_OFF()),
  },
  {
    // 默认 OFF
    file: 'timing',
    diagram: Diagram(Terminal('SET'), Terminal('TIMING'), ON_OFF_DEFAULT_OFF()),
  },
  {
    // 默认 OFF
    file: 'trims',
    diagram: Diagram(
      Terminal('SET'),
      Sequence(Terminal('TRIMS'), Optional(Terminal('POOL'))),
      ON_OFF_DEFAULT_OFF(),
    ),
  },
  {
    // 默认 OFF
    file: 'ver',
    diagram: Diagram(
      Terminal('SET'),
      Sequence(Terminal('VER'), Optional(Terminal('IFY'))),
      ON_OFF_DEFAULT_OFF(),
    ),
  },
  {
    // 默认 ON（默认折行）
    file: 'wra',
    diagram: Diagram(
      Terminal('SET'),
      Sequence(Terminal('WRA'), Optional(Terminal('P'))),
      ON_OFF_DEFAULT_ON(),
    ),
  },
];

const DOCS_DIR = join(__dirname, '../docs/v8/disql/api/environment-variable');
const RAILROAD_DIR = join(DOCS_DIR, 'railroad');

mkdirSync(RAILROAD_DIR, { recursive: true });

let updatedCount = 0;

for (const { file, diagram } of ENTRIES) {
  const svgPath = join(RAILROAD_DIR, `${file}.svg`);
  const mdPath = join(DOCS_DIR, `${file}.md`);

  writeFileSync(svgPath, makeSVG(diagram), 'utf8');

  let md = readFileSync(mdPath, 'utf8');
  const imageRef = `![语法图](./railroad/${file}.svg)`;

  if (md.includes(imageRef)) {
    // 已存在，无需重复插入
  } else {
    const syntaxSection = /## 语法\n(\n|$)/;
    if (!syntaxSection.test(md)) {
      console.warn(`⚠️  ${file}.md: 未找到空的 ## 语法 章节，跳过`);
      continue;
    }
    md = md.replace(syntaxSection, `## 语法\n\n${imageRef}\n\n`);
    writeFileSync(mdPath, md, 'utf8');
  }

  updatedCount++;
  console.log(`✓  ${file}`);
}

console.log(`\n完成：生成 ${ENTRIES.length} 张铁路图，处理 ${updatedCount} 个文档`);
