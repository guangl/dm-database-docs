import * as path from 'node:path';
import { defineConfig } from '@rspress/core';
import mermaid from 'rspress-plugin-mermaid';
import { nav } from './config/nav';
import { disqlSidebar } from './config/sidebar/disql';
import { rmanSidebar } from './config/sidebar/rman';

export default defineConfig({
  llms: false,
  root: path.join(__dirname, 'docs'),
  base: '/dm-database-docs/',
  title: '达梦数据库',
  plugins: [mermaid()],
  multiVersion: {
    default: 'v8',
    versions: ['v8'],
  },
  search: {
    versioned: false,
  },
  alias: {
    '@/components': path.join(__dirname, 'components'),
  },
  themeConfig: {
    enableScrollToTop: true,
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/guangl',
      },
    ],
    nav,
    sidebar: {
      '/tool/disql/': disqlSidebar,
      '/tool/rman/': rmanSidebar,
    },
  },
  builderConfig: {
    html: {
      tags: {
        tag: 'script',
        children: "window.RSPRESS_THEME = 'dark'",
      },
    },
  },
});
