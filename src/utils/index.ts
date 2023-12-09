import command from './command';
import config from './config';
import _package from './package';
import convert from './convert';
import io from './io';
import param from './param';
import translate from './translate';
import console from './console';
import version from './version';
import registry from './registry';
import git from './git';

export { default as command } from './command';
export { default as config } from './config';
export { default as package } from './package';
export { default as convert } from './convert';
export { default as io } from './io';
export { default as param } from './param';
export { default as translate } from './translate';
export { default as console } from './console';
export { default as version } from './version';
export { default as registry } from './registry';
export { default as git } from './git';

export default {
  command,
  config,
  package: _package,
  convert,
  io,
  param,
  translate,
  console,
  version,
  registry,
  git
};
