import { IConfig } from '@/interface';
import { types, scopes } from '..';

const user: IConfig = {
  commit: {
    types: types['zh-CN'],
    scopes: scopes['zh-CN']
  },
  package: {
    scripts: {
      prepare: 'prepare',
      dev: 'dev',
      build: 'build',
      eslint: 'eslint',
      test: 'test',
      'test:ci': 'test:ci',
      'test:watch': 'test:watch'
    },
    manager: {
      type: 'pnpm',
      registry: 'auto',
      commands: {
        install: '安装',
        uninstall: '卸载',
        update: '更新',
        outdated: '检查是否过时',
        list: '查看列表',
        info: '查看信息',
        search: '搜索',
        login: '登录',
        publish: '发布'
      }
    }
  },
  version: {
    validate: 'default',
    package: true
  },
  changelog: {
    file: {
      save: './changelogs'
    },
    translate: {
      origin: 'en',
      target: ['zh-CN', 'zh-TW', 'ru', 'ja', 'ko']
    },
    template: {
      content: '## 🎉 {{tag}} `{{date}}`\n{{logs}}',
      logs: {
        title: {
          standard: '\n### {{emoji}} {{Type}}',
          other: '\n### Other'
        },
        item: '- {{Message}} ({{commitlink}})',
        commitlink: {
          text: '#{{id[substr:7]}}',
          url: 'https://github.com/kwooshung/cvlar/commit/{{id}}'
        }
      }
    }
  },
  release: {
    subject: '🎉 {{tag}}',
    poweredby: true
  },
  i18n: {}
};

export default user;
