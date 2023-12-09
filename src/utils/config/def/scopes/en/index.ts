import { ICommitScope } from '@/interface';

const conf: ICommitScope[] = [
  { name: 'components', description: 'components' },
  { name: 'hooks', description: 'hooks' },
  { name: 'utils', description: 'utilities' },
  { name: 'lib', description: 'libraries' },
  { name: 'styles', description: 'styling' },
  { name: 'ui', description: 'User Interface adjustments' },
  { name: 'auth', description: 'Modifications to auth' },
  { name: 'performance', description: 'Performance optimizations' },
  { name: 'security', description: 'Security updates' },
  { name: 'i18n', description: 'Internationalization' },
  { name: 'docs', description: 'Documentation updates' },
  { name: 'changelog', description: 'Changelog updates' },
  { name: 'deps', description: 'Project dependencies' },
  { name: 'config', description: 'Configuration-related changes' },
  { name: 'test', description: 'testing' },
  { name: 'tools', description: 'Modifications to development tools' },
  { name: 'experiments', description: 'Experimental features' },
  { name: 'egg', description: 'Easter eggs, little surprises' },
  { name: 'backend', description: 'Backend-related changes' },
  { name: 'workflows', description: 'Workflow-related files changes' },
  { name: 'tag', description: 'New version, new tag' },
  { name: 'other', description: 'Other modifications' }
];

export default conf;
