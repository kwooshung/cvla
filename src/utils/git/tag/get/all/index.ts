import semver from 'semver';
import command from '../../../../command';

/**
 * 获取所有的 tag
 * @param {boolean} reverse 是否反转数组，因为默认是按照版本号从新到旧排序的
 * @returns {Promise<string[]>} 所有的 tag
 */
const all = async (reverse: boolean = false): Promise<string[]> => {
  const { stdout, stderr } = await command.execute('git tag -l');

  if (!stderr && stdout) {
    let tags = stdout.split('\n');

    if (tags.length) {
      tags = tags.filter((tag: string) => tag);
      tags.sort(semver.rcompare);

      reverse && tags.reverse();
      return tags;
    }
  }

  return [];
};

export default all;
