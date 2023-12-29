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
        validate:
          "(val){val = val.trim();if (val.length <= 0) {return 'Short description cannot be empty';} else if (val.length > 72) {return 'Short description must not exceed 72 characters';}return true;}"
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
      custom: false,
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
      complate: '(val) {return { fail: false, val };}',
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
      message: 'Version Number',
      description: 'Manage version numbers for upgrades, rollbacks, auto-updates, and commits',
      translate: {
        check: {
          message: 'Since other languages will use Google Translate, do you want to check the connection status?',
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
            {
              name: 'Alpha Version',
              value: 'alpha',
              description: '{0}, Alpha version, mainly for internal testing, may contain many bugs, incomplete features, and numerous errors'
            },
            {
              name: 'Beta Version',
              value: 'beta',
              description: '{0}, Beta version, still contains many bugs but is relatively more stable than alpha, and will continuously add new features'
            },
            {
              name: 'Release Candidate (rc)',
              value: 'rc',
              description: '{0}, Release candidate, close to the final product, mainly to find potential missing issues. If no major problems are found, this version may become the final release.'
            },
            {
              name: 'Stable Version',
              value: 'stable',
              description: '{0}, Stable version, relatively stable, and will not modify the code unless bugs are found or new requirements emerge'
            }
          ]
        },
        iterations: {
          message: {
            no: 'Current version number: {0}, no pre-release number, confirm to use {1} as the pre-release version number?',
            add: 'Current version number: {0}, pre-release type {1}, iteration number: {2}, use {3} as the pre-release version number?'
          },
          input: {
            message: 'Please enter the iteration version number:',
            validate:
              "(val){val = val.trim();if (val.length <= 0) {return 'Iteration version number cannot be empty';} else if (!val.test(/([1-9]d*)/)) {return 'Iteration version number format is incorrect';}return true;}"
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
