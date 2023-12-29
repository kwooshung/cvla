import createDir from './createDir';
import getDir from './getDir';
import exists from './exists';
import write from './write';
import read from './read';
import remove from './remove';
import copy from './copy';
import move from './move';

export { default as ioCreateDir } from './createDir';
export { default as ioRemove } from './remove';
export { default as ioExists } from './exists';
export { default as ioWrite } from './write';
export { default as ioRead } from './read';
export { default as ioCopy } from './copy';
export { default as ioMove } from './move';

export default {
  createDir,
  getDir,
  exists,
  write,
  read,
  remove,
  copy,
  move
};
