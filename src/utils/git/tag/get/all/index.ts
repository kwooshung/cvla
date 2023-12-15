import semver from 'semver';
import command from '../../../../command';

/**
 * 获取所有的 tag
 * @returns {Promise<string[]>} 所有的 tag
 */
const all = async (): Promise<string[]> => {
  const { stdout, stderr } = await command.execute('git tag -l');

  if (!stderr && stdout) {
    let tags = stdout.split('\n');

    if (tags.length) {
      tags = tags.filter((tag: string) => tag);
      tags.sort(semver.rcompare);

      return tags;
    }
  }

  return [];
};

export default all;
