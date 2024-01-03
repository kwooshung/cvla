const cvlarTypes = require('./scripts/ks-cvlar.types.cjs');
const cvlarScopes = require('./scripts/ks-cvlar.scopes.cjs');

/**
 * All configuration items below support this type of configuration. For example, to enable a configuration, just assign 'default', '{}' or 'No configuration item'. This will enable 'default configuration'.
 * To disable a configuration, just assign 'false'.
 * It is recommended to use the command 'cvlar i' to initialize the configuration file.
 */
module.exports = {
  // Git commit, convenient for selectively committing content from the menu
  commit: {
    types: cvlarTypes,
    scopes: cvlarScopes,
    // Describe the 'Git commit message' in your own language, which will then be automatically translated into 'English' by 'Google Translate', followed by the 'Git commit'
    submit: false
  },
  // Package management, convenient for selectively executing specific commands from the menu
  package: {
    /**
     * The scripts configuration in package.json, assigned as an object, as shown below:
     * {
     *   dev: 'npm run dev',
     *   build: 'npm run build',
     *   'test:watch': 'npm run build',
     *   ...
     * }
     *
     * Format description:
     *   key: Required. Represents the command name. It must match the 'key' in the 'scripts' section of 'package.json', otherwise the command will not execute correctly.
     *   value: Required, indicating command description, used to explain in the menu.
     *     An empty string means the key will be used directly in the menu.
     *     A non-empty string means the value will be used directly in the menu.
     */
    scripts: {
      prepare: 'prepare',
      dev: 'dev',
      build: 'build',
      eslint: 'eslint',
      test: 'test',
      'test:ci': 'test:ci',
      'test:watch': 'test:watch'
    },
    // Package management tool
    manager: {
      /**
       * Package management tool type, assigned as a string, assignable values:
       * The names of npm, yarn, pnpm, and other package management tools
       */
      type: 'pnpm',
      /**
       * Dependency source, default: auto, indicates according to the default source of the package management tool, generally: https://registry.npmjs.org
       * [Note]: This configuration will not affect the global or current project dependency source, only affects the dependency source when installing dependencies through this tool
       */
      registry: 'auto',
      /**
       * Package management command, format description:
       *   key：Required, indicating the command name, such as 'npm install xxx', 'key' is 'install'
       *   value: Required, indicating command description, used to explain in the menu.
       *     An empty string means the key will be used directly in the menu.
       *     A non-empty string means the value will be used directly in the menu.
       * Notice:
       *     1. The following default commands are based on npm, you can modify them yourself
       *     2. If you are using yarn or pnpm, there may be incompatibilities.
       *        You can modify the corresponding commands yourself
       *     3. The new versions of npm/yarn/pnpm commands are all compatible with each other.
       *        If there is any incompatibility, please modify the following commands or upgrade the package management tool
       */
      commands: {
        install: 'install',
        update: 'update',
        uninstall: 'uninstall',
        outdated: 'outdated',
        list: 'list',
        info: 'info',
        search: 'search',
        login: 'login',
        publish: 'publish'
      }
    }
  },
  // Version management, can be used to upgrade, cancel version number, automatic upgrade and submission
  version: {
    // Whether to automatically update the version number in package.json, boolean type, default: true
    package: true
  },
  // Changelog, automatically generates logs based on Git commit records
  changelog: {
    // Changelog file related configuration
    file: {
      save: './changelogs'
    },
    // Changelog translation related configuration
    translate: false,
    // Changelog template related configuration
    template: {
      /**
       * Content template of CHANGELOG file, supports md syntax
       *   default value:
       *  ## 🎉 {{tag}} `{{date}}`
       * {{logs}}
       * Logs will be sorted in order of submission type
       *
       * The currently supported variables are as follows:
       *   tag (required parameter):tag name
       *   date (optional parameter): date, e.g., 2023-12-17
       *   time (optional parameter): time, e.g., 04:59:39
       *   logs (required parameter): log content
       *
       * [Note] If there are already logs generated using this template and the `cvlar -r/release` auto-release feature is enabled,
       *        Recommend regenerating all logs to avoid potential inaccuracies in log content retrieval during automatic release with `cvlar -r/release`.
       */
      content: '## 🎉 {{tag}} `{{date}}`\n{{logs}}',
      /**
       * Categorize according to type, specific log content
       * If a translated version of the log already exists,
       * it is only valid for the newly generated log.
       * You can choose 'Regenerate all logs'
       */
      logs: {
        // Title template
        title: {
          /**
           * The standard title template, that is, the template when the `submission type` exists
           *
           * Usable variables:
           *   emoji: emoji corresponding to the `submission type`
           *   type: `submission type`, the first letter of the variable is capitalized, the first letter of the content will also be capitalized
           *   scope: submission scope, the first letter of the variable is capitalized, the first letter of the content will also be capitalized
           *   date: date, e.g., 2023-12-17
           *   time: time, e.g., 04:59:39
           */
          standard: '### {{emoji}} {{Type}}',
          // Other title templates, that is, templates when `submission type` does not exist, titles that cannot be classified according to `submission type`
          other: '### Other'
        },
        /**
         * Template for each log message
         *
         * Available variables:
         *   message: log message, if the variable starts with a capital letter, the content will start with a capital letter
         *   commitlink: link to the commit details page
         *   date: date, e.g., 2023-12-17
         *   time: time, e.g., 04:59:39
         */
        item: '- {{message}} ({{commitlink}})',
        /**
         * In the CHANGELOG file, each log entry has a specific commit details page
         * Used to link to the commit record details page
         */
        commitlink: {
          /**
           * Link Text
           *   id: Represents the commit ID
           *    [substr:n,l]:
           *    n (required parameter): Indicates the starting character for substring extraction. If l is not present, this parameter represents extracting from 0 to n characters
           *    l (optional parameter): Indicates the number of characters to extract
           */
          text: '#{{id[substr:7]}}',
          /**
           * Link address
           *
           * Available variables:
           * id: represents the full commit id, usually 40 characters long
           */
          url: 'https://github.com/kwooshung/you project name/commit/{{id}}'
        }
      }
    }
  },
  release: {
    /**
     * Release page, tag version title template
     *
     * Available variables:
     *   tag: tag name
     */
    subject: '🎉 {{tag}}',
    /**
     * Whenever you create a new tag and store it in the local git repository, and have not yet pushed it to the remote repository,
     * automatic log generation, translation, and file writing operations will be executed.
     * This will result in changes to your repository files, hence requiring you to commit these changes to the repository (usually only log changes),
     * thus, commit information is needed. However, it would be too cumbersome to manually select a commit type and commit scope for each tag submission, especially when the commit information is almost the same each time, so this configuration item was created
     *
     * However, since the tag stored in the local repository does not include the newly created logs,
     * it is necessary to revoke the tag from the local repository and recreate the same tag, so that it will include the new logs
     *
     * Therefore, the internal execution process looks like this:
     *  1. Create tag 1.0.0 (definitely will not include the log content of the second step)
     *  2. Generate logs based on the tag
     *  3. Store logs in the local git repository
     *  4. Revoke local git repository tag 1.0.0
     *  5. Recreate tag 1.0.0 (so it will include the logs generated based on the tag)
     *  6. Push the local repository to the remote repository
     *  7. Push the tag to the remote repository
     *
     *
     * Based on the `type`, `scope`, and `subject` below, the short description of the generated commit information:
     * The internal execution template: {{emoji}}{{type}}({{scope}}): {{subject}}
     *
     * If using the default `commit types` and `commit scopes` configuration
     * and if `subject` content is `new version {{tag}}`,
     * the final result would be:
     * 📦️ release(tag): new version 1.0.0
     */
    pushTagMessage: {
      /**
       * Commit type, referring to `commit.types` in this document,
       * will automatically match the submission type based on the `name` field
       *
       * 【Note】It is recommended to keep it consistent with the `name` field in `commit.types`
       */
      type: 'release',
      /**
       * Optional, `commit scopes`, the scope of the submission,
       * referring to `commit.scopes` in this document
       *
       * 【Note】It is recommended to keep it consistent with the `name` field in `commit.scopes`
       */
      scope: 'tag',
      /**
       * `commit subject`, the short description of the commit information
       *
       * Available variables:
       *  tag: tag name
       *
       * If commit message translation is enabled, i.e., the `commit.submit` configuration item is not false,
       * `commit.submit.origin` specifies the language in which this option should be written,
       * `commit.submit.target` will then translate the content into the specified language based on this configuration
       */
      subject: '{{tag}}'
    },
    /**
     * When multilingual support is enabled
     * i.e., when `changelog.translate.origin` and `changelog.translate.target` are not set to false, use this configuration
     */
    lang: {
      /**
       * Multilingual content template
       *
       * Available variables:
       *   name (required parameter): Language name
       *   code (optional parameter): Language code
       *
       * If not needed, set this option to false, and the title will not appear in the log
       */
      subject: '## 🌐 {{name}}({{code}})',
      // Separator between multilingual content
      separator: '\n\n'
    },
    /**
     * Boolean type, default: true
     * Whether to add the following markdown code at the end of each 'Release' in 'Github Release':
     *   > This [Changelog](CHANGELOG.md), Powered by @kwooshung/[cvlar](https://github.com/kwooshung/cvlar/)
     *   Here, `CHANGELOG.md` represents the relative path to the 'Changelog' entry file in your repository.
     *   Reference: https://github.com/kwooshung/cvlar/releases
     */
    poweredby: true
  },
  /**
   * Used for the internationalization of this tool’s prompt messages
   * Can be customized in any language, translate the following content into the desired language as needed
   */
  i18n: {
    // Yes, mainly used for single selection in menus, indicating selected
    yes: 'Yes',
    // No, mainly used for single selection in menus, indicating not selected
    no: 'No',
    /**
     * Maximum selectable amount, mainly used in menu options,
     * indicates the minimum number of options to display, extras require scrolling to view
     */
    choicesLimit: 15,
    // Multiple selection, can only be used for multiple choice related menu configurations
    checkbox: {
      // Default prompt when displaying multiple-choice menu, indicates key operations
      instructions: 'Press <space> to select, <a> to toggle all, <i> to invert selection, <enter> to confirm selection'
    },
    // Title of the primary menu
    select: 'I would like to ...',
    // scripts in package.json, used for running scripts in menus
    scripts: {
      // Title for running scripts in the menu
      message: 'Run',
      description: 'Choose a script to run',
      select: {
        message: 'Main Menu > Run > Select Script'
      }
    },
    // Git related
    git: {
      message: 'Git',
      description: 'Git Version Control',
      // Git commit related
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
        /**
         * Git commit message, short description,
         *
         *  Includes
         *    transformer: Optional, represents a value processing function
         *    validate: Optional, represents a validation function
         *
         *    Both functions can be customized, for more details see: https://github.com/SBoudrias/Inquirer.js/tree/master/packages/input
         */
        subject: {
          message: 'Short Description',
          description: 'Advised to keep under 72 characters',
          validate(val) {
            val = val.trim();
            if (val.length <= 0) {
              return 'Short description cannot be empty';
            } else if (val.length > 72) {
              return 'Short description must not exceed 72 characters';
            }
            return true;
          }
        },
        // Long description, also supports `transformer` and `validate`
        body: {
          message: 'Long Description',
          description: 'Use "|" for line breaks',
          // Whether a required field, boolean type, default: false
          required: false,
          // Prompt message for required fields
          requiredMessage: 'Long description cannot be empty'
        },
        // Breaking changes, not backwards compatible, also supports `transformer` and `validate`
        breaking: {
          message: 'BREAKING CHANGES',
          field: 'BREAKING CHANGE: ',
          required: false,
          requiredMessage: 'Long description cannot be empty'
        },
        /**
         * Custom fields, supports three types: `input`, `select`, `checkbox`, refer to the `.ks-cvlarrc.cjs` file in the root directory of this repository
         * Detailed explanations of this configuration are also available in the repository description
         * If not needed, the `custom` field can be deleted or set to `false`
         */
        custom: false,
        // Issues related
        issues: {
          message: 'Do you need to close any issues?',
          default: false,
          close: {
            message: 'Select keywords to close issues, supports multiple selections',
            // Issues related, customizable keywords, default: `fixes`, `resolves`, and `closes`
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
        /**
         * Upon generating the commit message, this function is triggered, allowing custom handling of the commit message format
         * The return value is an object, containing two properties, fail and val:
         *   fail: when true, the commit operation will not continue,
         *   val: the commit message
         * Can also be used for custom prompt messages
         */
        complate(val) {
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
          // true: automatically select yes, false: automatically select no, default: false
          default: false
        },
        tag: {
          message: 'Do you need to tag?',
          // true: automatically select yes, false: automatically select no, default: false
          default: false
        }
      },
      // Version upgrade/downgrade related
      version: {
        message: 'Version Number',
        description: 'Manage version numbers for upgrades, rollbacks, auto-updates, and commits',
        translate: {
          check: {
            message: 'will use Google Translate, do you want to check the connection status?',
            success: 'Connected to Google Translate successfully',
            fail: 'Connection failed',
            retry: 'Do you want to retry?',
            error: 'Unable to connect to Google Translate, unable to generate logs temporarily'
          }
        },
        select: {
          message: 'Please select an action'
        },
        upgrade: {
          message: 'Upgrade Version (Automatic)',
          description: 'Choose major, minor, or patch version to automatically calculate the next version number based on the current one',
          type: {
            message: 'Which version do you intend to upgrade',
            major: {
              message: 'Major',
              description: 'Generally introduces backward-incompatible API changes or significant feature changes.'
            },
            minor: {
              message: 'Minor',
              description: 'New backward-compatible features, recommended for updates when new features are beneficial to the project.'
            },
            patch: {
              message: 'Patch',
              description: 'Usually for minor bug fixes and updates, without affecting major functions and backward compatibility.'
            }
          }
        },
        specify: {
          message: 'Upgrade Version (Specified)',
          description: 'Fully customizable, but must comply with Semantic Versioning (SemVer)',
          input: {
            message: 'Please enter the version number:'
          }
        },
        downgrade: {
          message: 'Downgrade Version (Rollback/Revoke)',
          description: 'Revoke a specified version number, only revoking the version without modifying files',
          select: {
            message: 'Please select the version number to revoke',
            confirm: {
              message: 'Do you want to modify the version number in package.json?',
              default: true,
              remote: {
                message: 'Do you want to delete the tag from the remote repository?',
                default: false
              },
              change: {
                message: 'Which version number do you want to use in package.json?',
                descriptions: {
                  auto: 'Automatically calculate the previous version, which might not exist in past tags',
                  prevtag: 'Use the previous tag as the version number'
                },
                specify: {
                  message: 'Specify the version number'
                }
              }
            },
            error: {
              no: 'No version numbers available to revoke, please reselect'
            }
          }
        },
        flag: {
          message: 'Do you want to add a release identifier?',
          description: 'Could be a stable or pre-release version',
          select: {
            message: 'Select a release identifier',
            choices: [
              { name: 'Alpha Version', value: 'alpha', description: '{0}, Alpha version, mainly for internal testing, may contain many bugs, incomplete features, and numerous errors' },
              { name: 'Beta Version', value: 'beta', description: '{0}, Beta version, still contains many bugs but is relatively more stable than alpha, and will continuously add new features' },
              {
                name: 'Release Candidate (rc)',
                value: 'rc',
                description: '{0}, Release candidate, close to the final product, mainly to find potential missing issues. If no major problems are found, this version may become the final release.'
              },
              { name: 'Stable Version', value: 'stable', description: '{0}, Stable version, relatively stable, and will not modify the code unless bugs are found or new requirements emerge' }
            ]
          },
          iterations: {
            message: {
              no: 'Current version number: {0}, no pre-release number, confirm to use {1} as the pre-release version number?',
              add: 'Current version number: {0}, pre-release type {1}, iteration number: {2}, use {3} as the pre-release version number?',
              newno: 'Current version: {0}, new version is: {1}, no pre-release version exists. Would you like to use: {2} as the pre-release version?'
            },
            input: {
              message: 'Please enter the iteration version number:',
              validate(val) {
                val = val.trim();
                if (val.length <= 0) {
                  return 'Iteration version number cannot be empty';
                } else if (!val.test(/([1-9]d*)/)) {
                  return 'Iteration version number format is incorrect';
                }
                return true;
              }
            }
          }
        },
        annotate: {
          message: 'Do you want to add a description?',
          no: 'No Description',
          short: 'Short Description',
          long: 'Long Description (will open in text editor)',
          default: ''
        },
        file: {
          message: 'Do you want to update the version number in package.json?',
          default: true
        },
        push: {
          message: 'Do you want to push tags to the remote repository?',
          default: true
        },
        error: {
          exists: 'Current version number {0} already exists, please re-enter',
          format: 'Version number format does not comply with Semver standards, please re-enter'
        }
      }
    },
    // Package management related
    package: {
      message: 'Package Management',
      description: 'Install, update, uninstall, view, log in, publish, etc.',
      dependencies: '↓↓↓↓↓ [Production Dependencies] ↓↓↓↓↓',
      devDependencies: '↓↓↓↓↓ [Development Dependencies] ↓↓↓↓↓',
      commands: {
        message: 'Main Menu > Package Management > Choose Command',
        install: {
          message: 'Package Name:',
          description:
            "Format: vue react | vite vitest\nDescription:\n    · '|' left side means 'dependencies', right side means 'devDependencies'\n    · For installing 'dependencies' alone, '|' is not needed\n    · For installing only 'devDependencies', use '| vite vitest'",
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
            score: {
              final: 'Overall:',
              quality: 'Quality:',
              popularity: 'Popularity:',
              maintenance: 'Maintenance:',
              process: {
                /**
                 * Symbol for the progress bar of package scores in search results
                 *   If set as a string: '▇'
                 *     It would appear as: ▇▇▇▇▇▇▇▇▇▇▇▇
                 *
                 *   If set as an array of strings: ['▇', '_']
                 *     It would appear as: ▇▇▇▇________
                 */
                symbol: '▇',
                /**
                 * Length of the progress bar for package scores in search results,
                 *   Default: 50
                 *   The percentage will be automatically calculated based on the value
                 */
                length: 50,
                // Indicates whether the active part of the progress bar should be bold. Boolean type, default: false
                activeBold: false
              }
            },
            fields: {
              author: 'Author:',
              keywords: 'Keywords:',
              description: 'Description:'
            },
            error: {
              empty: 'Please enter search content',
              abnormal: 'Search error, please retry. Error details:'
            }
          },
          pagination: {
            message: 'Found {0} results, {1} per page, total {2} pages, currently on page {3}, you decide to:',
            // Number of items per page
            size: 10,
            // Page number range
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
    // Log related, also related to `cvlar -r`, if logging is not enabled, `cvlar -r` is also not available
    changelog: {
      message: 'Log Management',
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
        },
        template: {
          message:
            'Due to modifications in the log template `changelog.template.content`, the `cvlar -r` release function may not accurately identify the log content pending release. You will need to regenerate all logs. Do you wish to continue?'
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
    // Help related
    help: {
      message: 'Help',
      description: 'View help information'
    },
    // Return to previous menu
    back: {
      message: '..',
      description: 'Return to previous menu'
    },
    // Exit
    exit: {
      message: 'Exit'
    }
  }
};
