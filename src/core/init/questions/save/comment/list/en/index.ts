const list = {
  common: [
    "All configuration items below support this type of configuration. For example, to enable a configuration, just assign 'default', '{}' or 'No configuration item'. This will enable 'default configuration'.",
    "To disable a configuration, just assign 'false'.",
    "It is recommended to use the command 'cvlar i' to initialize the configuration file.",
    '',
    'Content below',
    '  {x} is a placeholder',
    '  {{xxx}} is a variable'
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
  version: 'Version management, can be used to upgrade, cancel version number, automatic upgrade and submission',
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
    "The target language of the CHANGELOG file, default 'en', can be an array, indicating translation into multiple languages",
    "If a translated version of the log already exists, it is only valid for the newly generated log. You can select 'Regenerate all logs'",
    'Supported language list: https://cloud.google.com/translate/docs/languages'
  ],
  'changelog.template': 'Changelog template related configuration',
  'changelog.template.content': [
    'Content template of CHANGELOG file, supports md syntax',
    '  default value:',
    ' ## 🎉 {{tag}} `{{date}}`',
    '{{logs}}',
    'Logs will be sorted in order of submission type',
    '',
    'The currently supported variables are as follows:',
    '  tag:tag name',
    '  date: date, e.g., 2023-12-17',
    '  time: time, e.g., 04:59:39',
    '  logs: log content'
  ],
  'changelog.template.logs': [
    'Categorize according to type, specific log content',
    'If a translated version of the log already exists,',
    'it is only valid for the newly generated log.',
    "You can choose 'Regenerate all logs'"
  ],
  'changelog.template.logs.title': 'Title template',
  'changelog.template.logs.title.standard': [
    'The standard title template, that is, the template when the `submission type` exists',
    '',
    'Usable variables:',
    '  emoji: emoji corresponding to the `submission type`',
    '  type: `submission type`, the first letter of the variable is capitalized, the first letter of the content will also be capitalized',
    '  scope: submission scope, the first letter of the variable is capitalized, the first letter of the content will also be capitalized',
    '  date: date, e.g., 2023-12-17',
    '  time: time, e.g., 04:59:39'
  ],
  'changelog.template.logs.title.other': 'Other title templates, that is, templates when `submission type` does not exist, titles that cannot be classified according to `submission type`',
  'changelog.template.logs.item': [
    'Template for each log message',
    '',
    'Available variables:',
    '  message: log message, if the variable starts with a capital letter, the content will start with a capital letter',
    '  commitlink: link to the commit details page',
    '  date: date, e.g., 2023-12-17',
    '  time: time, e.g., 04:59:39'
  ],
  'changelog.template.logs.commitlink': ['In the CHANGELOG file, each log entry has a specific commit details page', 'Used to link to the commit record details page'],
  'changelog.template.logs.commitlink.text': [
    'Link Text',
    '  id: Represents the commit ID',
    '   [substr:n,l]:',
    '   n (required parameter): Indicates the starting character for substring extraction. If l is not present, this parameter represents extracting from 0 to n characters',
    '   l (optional parameter): Indicates the number of characters to extract'
  ],
  'changelog.template.logs.commitlink.url': ['Link address', '', 'Available variables:', 'id: represents the full commit id, usually 40 characters long'],
  'changelog.template.separator': 'Separator between each version log in the CHANGELOG file, supports md syntax',
  'release.subject': ['Release page, tag version title template', '', 'Available variables:', '  tag: tag name', '  date: date, e.g., 2023-12-17', '  time: time, e.g., 04:59:39'],
  'release.poweredby': [
    'Boolean type, default: true',
    "Whether to add the following markdown code at the end of each 'Release' in 'Github Release':",
    '  > This [Changelog](CHANGELOG.md), Powered by @kwooshung/[cvlar](https://github.com/kwooshung/cvlar/)',
    "  Here, `CHANGELOG.md` represents the relative path to the 'Changelog' entry file in your repository.",
    '  Reference: https://github.com/kwooshung/cvlar/releases'
  ],
  i18n: ['Used for the internationalization of this tool’s prompt messages', 'Can be customized in any language, translate the following content into the desired language as needed'],
  'i18n.yes': 'Yes, mainly used for single selection in menus, indicating selected',
  'i18n.no': 'No, mainly used for single selection in menus, indicating not selected',
  'i18n.choicesLimit': ['Maximum selectable amount, mainly used in menu options, ', 'indicates the minimum number of options to display, extras require scrolling to view'],
  'i18n.checkbox': 'Multiple selection, can only be used for multiple choice related menu configurations',
  'i18n.checkbox.instructions': 'Default prompt when displaying multiple-choice menu, indicates key operations',
  'i18n.select': 'Title of the primary menu',
  'i18n.scripts': 'scripts in package.json, used for running scripts in menus',
  'i18n.scripts.message': 'Title for running scripts in the menu',
  'i18n.git': 'Git related',
  'i18n.git.commit': 'Git commit related',
  'i18n.git.commit.subject': [
    'Git commit message, short description, ',
    '',
    '   Includes',
    '     transformer: Optional, represents a value processing function',
    '     validate: Optional, represents a validation function',
    '',
    '   Both functions can be customized, for more details see: https://github.com/SBoudrias/Inquirer.js/tree/master/packages/input'
  ],
  'i18n.git.commit.body': 'Long description, also supports `transformer` and `validate`',
  'i18n.git.commit.body.required': 'Whether a required field, boolean type, default: false',
  'i18n.git.commit.body.requiredMessage': 'Prompt message for required fields',
  'i18n.git.commit.breaking': 'Breaking changes, not backwards compatible, also supports `transformer` and `validate`',
  'i18n.git.commit.custom': [
    'Custom fields, supports three types: `input`, `select`, `checkbox`, refer to the `.ks-cvlarrc.cjs` file in the root directory of this repository',
    'Detailed explanations of this configuration are also available in the repository description',
    'If not needed, the `custom` field can be deleted or set to `false`'
  ],
  'i18n.git.commit.issues': 'Issues related',
  'i18n.git.commit.issues.close.choices': 'Issues related, customizable keywords, default: `fixes`, `resolves`, and `closes`',
  'i18n.git.commit.issues.number.message': 'Issue ID numbers',
  'i18n.git.commit.complate': [
    'Upon generating the commit message, this function is triggered, allowing custom handling of the commit message format',
    'The return value is an object, containing two properties, fail and val:',
    '  fail: when true, the commit operation will not continue,',
    '  val: the commit message',
    'Can also be used for custom prompt messages'
  ],
  'i18n.git.commit.push.default': 'true: automatically select yes, false: automatically select no, default: false',
  'i18n.git.commit.tag.default': 'true: automatically select yes, false: automatically select no, default: false',
  'i18n.git.version': 'Version upgrade/downgrade related',
  'i18n.package': 'Package management related',
  'i18n.changelog': 'Log related, also related to `cvlar -r`, if logging is not enabled, `cvlar -r` is also not available',
  'i18n.help': 'Help related',
  'i18n.back': 'Return to previous menu',
  'i18n.exit': 'Exit'
};

export default list;
