import * as path from 'node:path';
import { defineConfig } from '@rspress/core';

export default defineConfig({
  llms: true,
  root: path.join(__dirname, 'docs'),
  base: '/dm-database-docs/',
  title: 'My Site',
  // multiVersion: {
  //   default: 'v8',
  //   versions: ['v8', 'v9'],
  // },
  themeConfig: {
    llmsUI: false,
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/guangl',
      },
    ],
  },
});
