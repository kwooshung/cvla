import basic from './basic';
import commit from './commit';
import pack from './package';
import version from './version';
import changelog from './changelog';
import release from './release';
import save from './save';

export { default as basic } from './basic';
export { default as commit } from './commit';
export { default as package } from './package';
export { default as version } from './version';
export { default as changelog } from './changelog';
export { default as release } from './release';
export { default as save } from './save';

export default {
  basic,
  commit,
  package: pack,
  version,
  changelog,
  release,
  save
};
