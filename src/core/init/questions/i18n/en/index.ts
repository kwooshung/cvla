const list = {
  yes: 'Yes',
  no: 'No',
  choicesLimit: 15,
  checkbox: {
    instructions: 'Press <space> to select, <a> to toggle all, <i> to invert selection, <enter> to confirm selection'
  },
  select: 'I would like to ...',
  scripts: {
    message: 'Run',
    description: 'Choose a script to run',
    select: {
      message: 'Main Menu > Run > Select Script'
    }
  },
  git: {
    message: 'Git',
    description: 'Git Version Control',
    commit: {
      message: 'Commit Code',
      description: 'Commit code to the Git repository',
      select: {
        message: 'Main Menu > Version Control'
      },
      type: {
        message: 'Select Commit Type'
      },
      scope: {
        message: 'Select Modification Scope'
      },
      subject: {
        message: 'Short Description',
        description: 'Advised to keep under 72 characters',
        validate: (val) => {
          val = val.trim();
          if (val.length <= 0) {
            return 'Short description cannot be empty';
          } else if (val.length > 72) {
            return 'Short description must not exceed 72 characters';
          }
          return true;
        }
      },
      body: {
        message: 'Long Description',
        description: 'Use "|" for line breaks',
        required: false,
        requiredMessage: 'Long description cannot be empty'
      },
      breaking: {
        message: 'BREAKING CHANGES',
        field: 'BREAKING CHANGE: ',
        required: false,
        requiredMessage: 'Long description cannot be empty'
      },
      custom: [
        {
          field: 'test1',
          type: 'input',
          message: 'This is an input demo, type anything and press comma',
          transformer: (val, { isFinal }) => {
            return isFinal ? val.split(' - ').join(', ') : val.split(',').join(' - ');
          },
          validate: (val) => {
            if (val.length <= 0) {
              return 'Input cannot be empty';
            }
            return true;
          }
        },
        {
          field: 'test2: ',
          type: 'select',
          message: 'This is a single-choice demo',
          choices: [
            {
              name: 'Option1',
              value: 'a',
              description: 'Description 1'
            },
            {
              name: 'Option2',
              value: 'b'
            },
            {
              name: 'Option3',
              value: 'c',
              description: 'Description 3'
            },
            {
              name: 'Option4',
              value: 'd',
              description: 'Description 4'
            },
            {
              name: 'Option5',
              value: 'e',
              description: 'Description 5'
            },
            {
              name: 'Option6',
              value: 'f',
              description: 'Description 6'
            },
            {
              name: 'Option7',
              value: 'g',
              description: 'Description 7'
            },
            {
              name: 'Option8',
              value: 'h',
              description: 'Description 8'
            },
            {
              name: 'Option9',
              value: 'i',
              description: 'Description 9'
            },
            {
              name: 'Option10',
              value: 'j',
              description: 'Description 10'
            },
            {
              name: 'Option11',
              value: 'k',
              description: 'Description 11'
            },
            {
              name: 'Option12',
              value: 'l',
              description: 'Description 12'
            },
            {
              name: 'Option13',
              value: 'm',
              description: 'Description 13'
            },
            {
              name: 'Option14',
              value: 'n',
              description: 'Description 14'
            },
            {
              name: 'Option15',
              value: 'o',
              description: 'Description 15'
            },
            {
              name: 'Option16',
              value: 'p',
              description: 'Description 16'
            },
            {
              name: 'Option17',
              value: 'q',
              description: 'Description 17'
            },
            {
              name: 'Option18',
              value: 'r',
              description: 'Description 18'
            },
            {
              name: 'Option19',
              value: 's',
              description: 'Description 19'
            },
            {
              name: 'Option20',
              value: 't',
              description: 'Description 20'
            }
          ],
          choicesLimit: 5,
          loop: false,
          default: 'b'
        },
        {
          field: false,
          type: 'checkbox',
          message: 'This is a multiple-choice demo',
          choices: [
            {
              name: 'Option1',
              value: 'm-a'
            },
            {
              name: 'Option2',
              value: 'm-b',
              description: 'Description 2',
              checked: true
            },
            {
              name: 'Option3',
              value: 'm-c',
              description: 'Description 3'
            },
            {
              name: 'Option4',
              value: 'm-d',
              description: 'Description 4'
            },
            {
              name: 'Option5',
              value: 'm-e',
              description: 'Description 5'
            },
            {
              name: 'Option6',
              value: 'm-f',
              description: 'Description 6'
            },
            {
              name: 'Option7',
              value: 'm-g',
              description: 'Description 7'
            },
            {
              name: 'Option8',
              value: 'm-h',
              description: 'Description 8'
            },
            {
              name: 'Option9',
              value: 'm-i',
              description: 'Description 9'
            },
            {
              name: 'Option10',
              value: 'm-j',
              description: 'Description 10'
            },
            {
              name: 'Option11',
              value: 'm-k',
              description: 'Description 11'
            },
            {
              name: 'Option12',
              value: 'm-l',
              description: 'Description 12'
            },
            {
              name: 'Option13',
              value: 'm-m',
              description: 'Description 13'
            },
            {
              name: 'Option14',
              value: 'm-n',
              description: 'Description 14'
            },
            {
              name: 'Option15',
              value: 'm-o',
              description: 'Description 15'
            },
            {
              name: 'Option16',
              value: 'm-p',
              description: 'Description 16'
            },
            {
              name: 'Option17',
              value: 'm-q',
              description: 'Description 17'
            },
            {
              name: 'Option18',
              value: 'm-r',
              description: 'Description 18'
            },
            {
              name: 'Option19',
              value: 'm-s',
              description: 'Description 19'
            },
            {
              name: 'Option20',
              value: 'm-t',
              description: 'Description 20'
            }
          ],
          loop: true
        }
      ],
      issues: {
        message: 'Do you need to close any issues?',
        default: false,
        close: {
          message: 'Select keywords to close issues, supports multiple selections',
          choices: [
            { name: 'Fix', value: 'fixes', description: 'Fix' },
            { name: 'Enhance', value: 'resolves', description: 'Enhance' },
            { name: 'Close', value: 'closes', description: 'Close' }
          ],
          number: {
            message: 'Issue number(s) for {0} (e.g., #11 #17 #27)'
          }
        }
      },
      translate: {
        connect: {
          message: 'Connecting to Google Translate and checking availability...',
          success: 'Connected to Google Translate successfully',
          fail: 'Failed to connect to Google Translate'
        },
        process: {
          message: 'Translating submission information...',
          success: 'Translation successful',
          fail: 'Translation failed, error details:'
        },
        error: {
          config: 'Error in commit.submit configuration'
        }
      },
      complate(val: string) {
        return { fail: false, val };
      },
      confirm: {
        message: 'Please confirm if the final information is correct?',
        yes: 'Correct, submit directly',
        no: 'Inaccurate, modify with `text editor` then submit',
        editor: {
          message: 'Press <enter> to open `text editor`, save after modification and close to submit'
        }
      },
      push: {
        message: 'Do you want to push to remote repository?',
        default: false
      },
      tag: {
        message: 'Do you need to tag?',
        default: false
      }
    },
    version: {
      message: '版本号',
      description: '版本号管理，可用于升级、撤销 版本号，自动升级和提交',
      select: {
        message: '请选择操作'
      },
      upgrade: {
        message: '升级版本（自动）',
        description: '选择 主版本号、次版本号 或 补丁版本号，自动根据 当前版本号，计算下个版本号',
        type: {
          message: '您打算升级哪个版本',
          major: {
            message: '主要',
            description: '一般引入了不向后兼容的 API 更改或重大功能更改。'
          },
          minor: {
            message: '次要',
            description: '新的向后兼容功能，建议在确定新功能对项目有用时进行更新。'
          },
          patch: {
            message: '补丁',
            description: '通常用于小的错误修复和更新，不影响软件的主要功能和向后兼容性。'
          }
        }
      },
      specify: {
        message: '升级版本（指定）',
        description: '完全由您自定义，但是也得符合语义化版本规范（SemVer）',
        input: {
          message: '请输入版本号：'
        }
      },
      downgrade: {
        message: '降级版本（回退/撤销）',
        description: '撤销指定版本号，仅撤销版本，不会对文件产生修改',
        select: {
          message: '请选择要撤销的版本号',
          confirm: {
            message: '是否修改 package.json 中的版本号？',
            default: true,
            remote: {
              message: '是否删除远程仓库中的 tag？',
              default: false
            },
            change: {
              message: '您想使用哪个版本号 package.json 中？',
              descriptions: {
                auto: '自动计算前一个版本，但在以往的tags中，可能不存在这个版本号',
                prevtag: '将使用前一个tag作为版本号'
              },
              specify: {
                message: '指定版本号'
              }
            }
          },
          error: {
            no: '没有可撤销的版本号，请重新选择'
          }
        }
      },
      flag: {
        message: '是否添加发布标识符？',
        description: '可能是 稳定版本 或 预发布版本',
        select: {
          message: '选择发布标识符',
          choices: [
            {
              name: '预览版 (alpha)',
              value: 'alpha',
              description: '{0}，预览版，主要用于内部测试，可能包含很多BUG，功能不全，存在很多错误'
            },
            {
              name: '测试版 (beta)',
              value: 'beta',
              description: '{0}，该版本任然存在很多BUG，但是相对alpha版要稳定一些，会不断增加新功能'
            },
            {
              name: '候选版本 (rc)',
              value: 'rc',
              description: '{0}，这个版本接近最终产品，主要目的是查找可能的遗漏的问题。如果没有发现重大问题，这个版本可能就会成为最终发布的版本。'
            },
            {
              name: '正式版本 (stable)',
              value: 'stable',
              description: '{0}，正式版本，该版本相对稳定，基本不会再修改代码，除非发现BUG，或者出现新的需求'
            }
          ]
        },
        iterations: {
          message: {
            no: '当前版本号：{0}，不存在预发号，确认使用 {1} 作为预发版本号？',
            add: '当前版本号：{0}，预发版本类型为{1}，迭代号为：{2}，是否使用 {3} 作为预发版本号？'
          },
          input: {
            message: '请输入迭代版本号：',
            validate: (val: any) => {
              val = val.trim();
              if (val.length <= 0) {
                return '迭代版本号不能为空';
              } else if (!val.test(/([1-9]\d*)/)) {
                return '迭代版本号格式不正确';
              }
              return true;
            }
          }
        }
      },
      annotate: {
        message: '是否添加说明？',
        no: '无说明',
        short: '短说明',
        long: '长说明（将使用文本编辑器打开）',
        default: ''
      },
      file: {
        message: '是否更新 package.json 中的版本号？',
        default: true
      },
      push: {
        message: '是否推送 tags 到远程仓库？',
        default: true
      },
      error: {
        exists: '当前版本号 {0} 已存在，请重新输入',
        format: '版本号格式不符合 Semver语义化标准，请重新输入'
      }
    }
  },
  package: {
    message: 'Package Management',
    description: 'Install, update, uninstall, view, log in, publish, etc.',
    dependencies: '↓↓↓↓↓ [Production Dependencies] ↓↓↓↓↓',
    devDependencies: '↓↓↓↓↓ [Development Dependencies] ↓↓↓↓↓',
    commands: {
      message: 'Main Menu > Package Management > Choose Command',
      install: {
        message: 'Package Name:',
        description: `Format: vue react | vite vitest\nDescription:\n    · '|' left side means 'dependencies', right side means 'devDependencies'\n    · For installing 'dependencies' alone, '|' is not needed\n    · For installing only 'devDependencies', use '| vite vitest'`,
        error: {
          format: 'Format error, please re-enter'
        }
      },
      uninstall: {
        message: 'Choose the package to uninstall'
      },
      update: {
        message: 'Choose the package to update',
        loadings: {
          reading: 'Reading package.json file...',
          request: 'Fetching from https://registry.npmjs.org...',
          analysing: 'Analysing dependencies... {0}'
        },
        error: {
          noUpdate: 'No packages to update, recheck?',
          nonSelect: 'Please select a package to update first'
        },
        dev: 'Development Dependencies',
        prod: 'Production Dependencies',
        category: {
          major: {
            message: 'Major Update',
            description:
              'May introduce backwards incompatible API changes or major feature changes. It is advised to review update logs and documentation before updating to ensure the new version does not break the project.'
          },
          minor: {
            message: 'Minor Update',
            description: 'New backwards compatible features, advised to update when the new features are useful to the project.'
          },
          patch: {
            message: 'Patch Update',
            description: 'Usually for small bug fixes and updates, does not affect the main functions and backward compatibility of the software.'
          },
          prerelease: {
            message: 'Pre-release',
            description: 'Pre-release version, may contain new features or bug fixes. Update with caution.'
          },
          nonsemver: {
            message: 'Non-Semantic Versioning',
            description:
              'Indicates package version does not conform to Semantic Versioning (SemVer), usually versions less than 1.0.0. These versions may be unstable and introduce significant changes, hence should be used cautiously.'
          }
        }
      },
      list: {
        dependencies: 'Production Dependencies',
        devDependencies: 'Development Dependencies'
      },
      info: {
        message: 'Choose the package to view details',
        link: 'Homepage:',
        other: 'Do you want to view information of other packages?'
      },
      search: {
        message: 'Search package name:',
        loading: 'Fetching search data from https://www.npmjs.com/, please wait...',
        result: {
          // Date and time formatting translation
          date: {
            format: 'YYYY-MM-DD HH:mm:ss',
            second: 'seconds ago',
            seconds: 'seconds ago',
            minute: 'minute ago',
            minutes: 'minutes ago',
            hour: 'hour ago',
            hours: 'hours ago',
            day: 'day ago',
            days: 'days ago',
            week: 'week ago',
            weeks: 'weeks ago',
            month: 'month ago',
            months: 'months ago'
          },
          // Flags translation
          flags: {
            insecure: {
              yes: 'Insecure:',
              no: 'Secure'
            },
            unstable: {
              yes: 'Unstable',
              no: 'Stable'
            }
          },
          // Score translation
          score: {
            final: 'Overall:',
            quality: 'Quality:',
            popularity: 'Popularity:',
            maintenance: 'Maintenance:',
            process: {
              symbol: '▇',
              length: 50,
              activeBold: false
            }
          },
          // Fields translation
          fields: {
            author: 'Author:',
            keywords: 'Keywords:',
            description: 'Description:'
          },
          // Error messages translation
          error: {
            empty: 'Please enter search content',
            abnormal: 'Search error, please retry. Error details:'
          }
        },
        // Pagination translation
        pagination: {
          message: 'Found {0} results, {1} per page, total {2} pages, currently on page {3}, you decide to:',
          size: 10,
          range: 10,
          next: 'Next Page',
          prev: 'Previous Page',
          n: 'Page {0}',
          first: 'First Page',
          last: 'Last Page',
          goto: {
            jump: 'Jump to specified page',
            message: 'Enter page number:',
            error: 'Page number format error, please re-enter'
          },
          delimiter: {
            keyword: 'Keyword:',
            result: 'Result:',
            pageSize: 'Per Page:',
            pageTotal: 'Total Pages:',
            pageCurrent: 'Current:'
          },
          error: {
            format: 'Format error, please re-enter'
          }
        },
        error: {
          input: 'Please enter search content'
        }
      }
    }
  },
  changelog: {
    title: 'Main Menu > Log Management',
    build: {
      message: 'Generate Log',
      description: 'Automatically calculate the logs to generate',
      success: 'Log generated successfully',
      error: 'Log generation failed, retry?',
      translate: {
        check: {
          message: 'Other languages will use Google Translate, check connection status?',
          success: 'Connected to Google Translate successfully',
          fail: 'Connection failed',
          retry: 'Retry?',
          error: 'Unable to connect to Google Translate, unable to generate log temporarily'
        },
        fail: {
          retry: 'Translation failed, retry?'
        },
        translateing: 'Translating progress:'
      }
    },
    rebuild: {
      message: 'Rebuild',
      description: 'Will delete all previously generated log files and regenerate',
      confirm: {
        message: 'This operation may take some time, continue?',
        description: 'This will delete all previously generated log files and regenerate, which may take some time'
      }
    },
    clean: {
      message: 'Clean Logs',
      description: 'Delete all previously generated log files',
      confirm: {
        message: 'This will delete all previously generated log files, continue?',
        description: 'This process is irreversible'
      },
      retry: {
        message: 'Failed to clean logs, retry?',
        default: true
      }
    },
    loading: {
      git: {
        tag: {
          reading: 'Reading local git repository tags...',
          success: 'Successfully read local git repository tags',
          retry: {
            message: 'Failed to read tags, retry?',
            default: true
          }
        },
        messages: {
          reading: 'Reading local git repository commit messages...',
          success: 'Successfully read local git repository commit messages',
          retry: {
            message: 'Failed to read commit messages, retry?',
            default: true
          }
        }
      },
      history: {
        diffing: 'Comparing...',
        done: {
          success: {
            build: 'Starting to generate logs...',
            no: 'No logs to generate'
          },
          fail: {
            message: 'No record file {0} found, generate all logs?',
            description: 'This will clean all previously generated log files and regenerate, which may take some time',
            default: true
          }
        }
      },
      build: {
        message: 'Generating logs...',
        success: 'Log generated successfully',
        fail: 'Log generation failed, retry?'
      },
      translate: {
        connect: {
          message: 'Connecting to Google Translate and checking availability...',
          success: 'Connected to Google Translate successfully',
          fail: 'Failed to connect to Google Translate'
        },
        process: {
          message: 'Translating logs...',
          success: 'Translation successful',
          fail: 'Translation failed, error details:'
        }
      },
      write: {
        message: 'Writing log files...',
        success: 'Logs written successfully',
        retry: 'Failed to write logs, retry?',
        fail: 'Failed to write logs'
      },
      clean: {
        message: 'Cleaning logs...',
        success: 'Logs cleaned successfully'
      }
    }
  },
  help: {
    message: 'Help',
    description: 'View help information'
  },
  back: {
    message: '..',
    description: 'Return to previous menu'
  },
  exit: {
    message: 'Exit'
  }
};

export default list;
