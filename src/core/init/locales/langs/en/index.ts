import pc from 'picocolors';
import { version } from '@/utils';

const lang = {
  colon: ':',
  yes: 'Yes',
  no: 'No',
  enabled: 'Enabled',
  disabled: 'Disabled',
  fileExists: 'The file {0} already exist, overwrite?',
  filesExists: 'The files {0} already exist, overwrite?',
  recommend: pc.green('Recommended'),
  checkbox: {
    instructions: 'Press <space> to select, <a> to toggle all, <i> to invert selection, <Enter> to confirm'
  },
  exits: {
    message: 'Configuration file already exists. Overwrite?',
    description: {
      yes: 'The existing configuration file will be overwritten after setup',
      no: 'Will exit'
    }
  },
  basic: {
    title: 'Basics',
    standard: {
      message: 'Which standard do you plan to use?'
    },
    extension: {
      message: 'Extension for the configuration file?'
    }
  },
  commit: {
    title: 'Commit',
    message: 'Commit submission feature',
    lint: {
      message: 'commitlint standard',
      standalone: {
        message: `Detected ${pc.green('commitlint')} is installed. It's recommended to separate ${pc.green('commit type')} and ${pc.green(
          'commit scope'
        )} into individual files for unified configuration. Separate them?`
      },
      emoji: {
        message: 'Emoji expressions?'
      },
      lang: {
        message: `Language for explaining ${pc.green('commit type/scope')}?`,
        other: {
          message: 'Other?',
          check: {
            message: `Since ${pc.green('other languages')} will use ${pc.green('Google Translate')}, check connection status?`,
            success: `Connection successful(${pc.green('✔')}) . Which language would you like to translate to?`,
            fail: {
              message: `Connection failed(${pc.red('✖')}) . You can only choose a language from the list below.`,
              description: 'You can also change to any language you need in the configuration file later'
            }
          },
          translating: pc.green('! Translation Progress: ')
        },
        scope: {
          message: `${pc.green('commit scope')} enabled?`
        }
      }
    },
    content: {
      message: `Since the explanations for ${pc.green('commit type/scope')} are not in ${pc.blue('English')}, do you want to translate ${pc.yellow('each commit')} content into ${pc.blue(
        'English'
      )} using ${pc.blue('Google Translate')} for global readability?`,
      description: 'Of course, machine translation might not be accurate',
      confirm: {
        message: `To ensure translation accuracy, are you sure to write every ${pc.green('commit message')} in ${pc.green('{0}')}?`,
        description: 'You can also change to any language you need in the configuration file later',
        other: {
          message: 'Then, which language would you like to translate into English?'
        }
      }
    },
    save: {
      message: `Where do you want to save the ${pc.green('commit type/scope')}?`,
      success: {
        message: `${pc.green('✔')} Saved successfully. Path: {0}`
      },
      fail: {
        message: `Save failed. Save again?`
      }
    }
  },
  package: {
    title: 'Package Management',
    message: 'Package management feature',
    description: `Provides a ${pc.blue(
      'terminal interface menu'
    )} for package management with the following advantages:\n  1. Enhances efficiency and optimizes operations, user-friendly for beginners, just remember one command ${pc.blue(
      'cvlar'
    )};\n  2. Install, uninstall, update dependencies, view dependencies, view dependency update logs, etc.;\n  3. Manage scripts, alias commands, and select commands through the interface;\n  ...`,
    scripts: {
      select: {
        message: 'Select scripts to manage?',
        error: 'At least one must be selected'
      }
    },
    manager: {
      message: 'Package manager',
      type: {
        message: 'Type of manager?',
        auto: 'Auto-detect',
        description: 'Can also be modified later in the configuration file'
      },
      registry: {
        message: 'Dependency source?',
        description: 'Only affects dependencies installed through this tool, can also be modified later in the configuration file',
        auto: {
          message: 'Use the Default Source of the Package Manager',
          description: 'Can also be modified later in the configuration file'
        }
      },
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
  version: {
    title: 'Version Control',
    message: 'Version management feature',
    description: 'Enables version upgrade functionality, allowing for version upgrades, specifying version numbers, reverting version numbers, etc.',
    validate: {
      message: 'Use default version number validation rules?',
      description: `Default rule: ${version.regex.toString()}\n      Examples:${version.example}`,
      change: {
        message: `Enter a new validation rule, or press ${pc.green('Enter')} to use the ${pc.yellow('default rule')}?`
      }
    },
    package: {
      message: `Modify the version number in package.json ${pc.green('(Recommended)')}?`
    }
  },
  changelog: {
    title: 'Logs',
    message: 'Generate changelog?',
    description: 'Enables changelog functionality, allowing for the generation of changelogs based on commit information',
    file: {
      message: 'Configure file storage rules?',
      limit: {
        message: 'How many version logs to record?',
        description: 'Default is 10, not 10 lines of logs, but 10 versions of logs'
      },
      history: {
        message: 'Directory for storing historical logs?',
        description: 'Default is ./changelogs'
      },
      save: {
        message: 'Filename for saving the log?',
        description: 'Default is ./changelog'
      }
    },
    translate: {
      message: 'Enable translation?',
      origin: {
        message: {
          auto: `${pc.green('✔')} ${pc.yellow('Commit messages')} will be written in ${pc.green('{0}')} and automatically translated into ${pc.green(
            'English'
          )}; since the log is generated from ${pc.yellow('commit messages')}, the original content of the log will be: ${pc.blue('{0}')}`,
          manual: `What is the original language of the log? That is, in what language are your ${pc.yellow('commit messages')} written?`
        },
        description: 'Default is zh-CN'
      },
      target: {
        message: `Target language?`,
        description: 'Default is English'
      },
      statement: {
        message: 'Translation statement?',
        description:
          '    Note: A different translation statement will be displayed for different languages, stating: “The following content is automatically translated by Google Translate and may not be accurate.”\n  Preview: > 🚩 The following content is automatically translated by Google Translate and may not be accurate.',
        content: {
          message: 'Statement starting content?'
        }
      }
    },
    template: {
      message: 'Configure template?',
      before: {
        message: 'Header content template for each log file (leave blank for no header)?'
      },
      content: {
        message: 'Content template for each log entry (leave blank for default template)?'
      },
      separator: {
        message: 'Separator between versions (leave blank for default separator: \\n\\n---\\n\\n)?',
        description: ''
      },
      after: {
        message: 'Footer content template for each log file (leave blank for no footer)?'
      }
    },
    poweredby: {
      message: `After automatic publishing via ${pc.green('Github Actions')}, a link to ${pc.green('View all logs')} will be inserted at the end?`,
      description:
        "At the end of each 'Release' in 'Github Release', add the following markdown code:\n    This [Changelog](/{0}), Powered by @kwooshung / [cvlar](https://github.com/kwooshung/cvlar/)\n    Here, `{0}` represents the relative path to the 'Changelog' entry file in your repository.\n    Reference: https://github.com/kwooshung/cvlar/releases"
    }
  },
  save: {
    title: 'Save',
    message: `Where would you like to save the ${pc.green('configuration file')}?`,
    filename: {
      message: 'What would you like the filename of the configuration file to be?'
    },
    success: {
      message: `${pc.green('✔')} Successfully saved. The path is: {0}`
    },
    fail: {
      message: `${pc.red('✖')} Failed to save ({0}/{1}). Would you like to try saving again?`,
      finally: `${pc.red('✖')} Save failed. You can manually create the configuration file according to the documentation. Here is the content of the configuration file:\n\n{0}`
    },
    ing: 'Saving...'
  }
};

export default lang;
