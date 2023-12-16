const list = {
  common: [
    "All configuration items below support this type of configuration. For example, to enable a configuration, just assign 'default', '{}' or 'No configuration item'. This will enable 'default configuration'.",
    "To disable a configuration, just assign 'false'.",
    "It is recommended to use the command 'cvlar i' to initialize the configuration file."
  ],
  commit: 'Git commit, convenient for selectively committing content from the menu',
  'commit.type': [
    'Git commit types, assigned as an array, as shown below:',
    '[',
    '  {',
    "    emoji: '✨', Optional: Not setting it means emoji will not be used",
    "    name: 'Feature', Required: Commit type name, will be part of the Git commit message, e.g., ✨Feature(Scopes): New feature",
    "    description: 'New feature' Required: For remarks in the menu, won't appear in the Git commit message",
    '  },',
    '  {',
    "    emoji: '🐛',",
    "    name: 'Fix',",
    "    description: 'Bug Fix'",
    '  },',
    '  ...',
    ']'
  ],
  'commit.scope': [
    'Git commit scope, assigned as an array, as shown below:',
    '[',
    '  {',
    "    name: 'i18n', Required: Commit scope name, will be part of the Git commit message, e.g., ✨Feature(i18n): New feature",
    "    description: 'Internationalization' Required: For remarks in the menu, won't appear in the Git commit message",
    '  },',
    '  {',
    "    name: 'docs',",
    "    description: 'Documentation update'",
    '  },',
    '  ...',
    ']'
  ],
  'commit.submit': "Describe the 'Git commit message' in your own language, which will then be automatically translated into 'English' by 'Google Translate', followed by the 'Git commit'",
  'commit.submit.origin': ["In what language would you like to describe the 'Git commit message'", '  Supported languages list: https://cloud.google.com/translate/docs/languages'],
  'commit.submit.target': [
    "Into what language do you wish to translate the 'Git commit message', supported languages list as above",
    '  Supported languages list: https://cloud.google.com/translate/docs/languages'
  ],
  package: 'Package management, convenient for selectively executing specific commands from the menu',
  'package.scripts': [
    'The scripts configuration in package.json, assigned as an object, as shown below:',
    '{',
    "  dev: 'npm run dev',",
    "  build: 'npm run build',",
    "  'test:watch': 'npm run build',",
    '  ...',
    '}',
    '',
    'Format description:',
    "  key: Required. Represents the command name. It must match the 'key' in the 'scripts' section of 'package.json', otherwise the command will not execute correctly.",
    '  value: Required, indicating command description, used to explain in the menu.',
    '    An empty string means the key will be used directly in the menu.',
    '    A non-empty string means the value will be used directly in the menu.'
  ],
  'package.manager': 'Package management tool',
  'package.manager.type': ['Package management tool type, assigned as a string, assignable values:', 'The names of npm, yarn, pnpm, and other package management tools'],
  'package.manager.registry': [
    'Dependency source, default: auto, indicates according to the default source of the package management tool, generally: https://registry.npmjs.org',
    'Note: This configuration will not affect the global or current project dependency source, only affects the dependency source when installing dependencies through this tool'
  ],
  'package.manager.commands': [
    'Package management command, format description:',
    "  key：Required, indicating the command name, such as 'npm install xxx', 'key' is 'install'",
    '  value: Required, indicating command description, used to explain in the menu.',
    '    An empty string means the key will be used directly in the menu.',
    '    A non-empty string means the value will be used directly in the menu.',
    'Notice:',
    '    1. The following default commands are based on npm, you can modify them yourself',
    '    2. If you are using yarn or pnpm, there may be incompatibilities.',
    '       You can modify the corresponding commands yourself',
    '    3. The new versions of npm/yarn/pnpm commands are all compatible with each other.',
    '       If there is any incompatibility, please modify the following commands or upgrade the package management tool'
  ],
  'version.validate': [
    'Regular expression for validating version numbers, regex object',
    '  Regex explanation: https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string',
    '  Regex demo: https://regex101.com/r/vkijKf/1/'
  ],
  'version.package': 'Whether to automatically update the version number in package.json, boolean type, default: true',
  changelog: 'Changelog, automatically generates logs based on Git commit records',
  'changelog.file': 'Changelog file related configuration',
  'changelog.file.limit': [
    'The number of recorded versions in the CHANGELOG file',
    '0 means no limit, all records; ',
    'Default 10 logs with version numbers (not only 10 lines of logs can be written, but 10 versions of records)',
    'Indicates that each file can record up to 10 records and automatically paginate',
    'If there are more than 10 items, a new CHANGELOG file will be automatically created with the file name md5(content).md, and so on',
    '',
    'If the limit number is not met, all logs will be stored in the index.md file in this directory;',
    'When there are different translation versions, corresponding directories will be automatically created based on the language code, such as: zh-CN/index.md, en/index.md, etc.;',
    'You can create a CHANGELOG.md file in the project root directory and link to the index.md file in this directory;',
    '',
    'If this configuration has been applied and logs are generated, it will only affect subsequently generated logs',
    'If you want to apply the new configuration to all',
    'Use the `log management` function, `regenerate the log` or `clean the log`, and then `regenerate`'
  ],
  'changelog.save': 'Log storage directory',
  'changelog.translate': 'Changelog translation related configuration',
  'changelog.translate.origin': ["Original language of the CHANGELOG file, default 'zh-CN'", '  Supported languages list: https://cloud.google.com/translate/docs/languages'],
  'changelog.translate.target': [
    "Target language for the CHANGELOG file, default 'en', can be an array, indicating translation into multiple languages",
    '  Supported languages list: https://cloud.google.com/translate/docs/languages'
  ],
  'changelog.translate.statement': [
    'Translation statement starting marker, default value: > 🚩',
    "Supports 'md syntax'",
    "  Only when 'translated by translation tool', this statement will be added at the beginning of the translation",
    '  For example:',
    '    The following content is automatically translated by Google Translate and may be inaccurate',
    "    This statement will also be translated into different versions by the 'translation tool'",
    '  Reference: https://github.com/kwooshung/cvlar/releases'
  ],
  'changelog.template': 'Changelog template related configuration',
  'changelog.template.before': 'Header template of the CHANGELOG file, supports md syntax',
  'changelog.template.content': [
    'Content template of CHANGELOG file, supports md syntax',
    '  default value:',
    ' ## 🎉 {{tag}} `{{date}}`',
    '{{logs}}',
    'Logs will be sorted in order of submission type',
    'The currently supported variables are as follows:',
    'tag:tag name',
    'date: date, such as: 2023-12-15',
    ' time: time, such as: 12:15:30',
    'logs: log content'
  ],
  'changelog.template.commiturl': [
    'In the CHANGELOG file, the submission id of the template of each log,',
    'is used to jump to the link to the submission record details page,',
    'if it is empty or left blank, no link will be generated '
  ],
  'changelog.template.separator': 'Separator between each version log in the CHANGELOG file, supports md syntax',
  'changelog.template.after': 'Footer template of the CHANGELOG file, supports md syntax',
  'changelog.poweredby': [
    'Boolean type, default: true',
    "Whether to add the following markdown code at the end of each 'Release' in 'Github Release':",
    '  This [Changelog](/{0}), Powered by @kwooshung / [cvlar](https://github.com/kwooshung/cvlar/)',
    "  Here, `{0}` represents the relative path to the 'Changelog' entry file in your repository.",
    '  Reference: https://github.com/kwooshung/cvlar/releases'
  ],
  i18n: ['Used for the internationalization of this tool’s prompt messages', 'Can be customized in any language, translate the following content into the desired language as needed']
};

export default list;
