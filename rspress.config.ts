import * as path from 'node:path';
import { defineConfig } from '@rspress/core';
export default defineConfig({
  llms: true,
  root: path.join(__dirname, 'docs'),
  base: '/dm-database-docs/',
  title: '达梦数据库',
  description: '达梦数据库文档',
  lang: 'zh',
  plugins: [],
  multiVersion: {
    default: 'v8',
    versions: ['v8'],
  },
  search: {
    versioned: false,
  },
  themeConfig: {
    enableScrollToTop: true,
    enableContentAnimation: true,
    editLink: {
      docRepoBaseUrl: 'https://github.com/guangl/dm-database-docs/edit/main/docs',
    },
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/guangl',
      },
    ],
    // nav,
    // sidebar: {
    //   '/tool/disql/': disqlSidebar,
    //   '/tool/rman/': rmanSidebar,
    // },
  },
  builderConfig: {
    html: {
      tags: [
        {
          tag: 'script',
          children: "window.RSPRESS_THEME = 'dark'",
        },
      ],
    },
  },
});
