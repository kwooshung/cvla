import semver from 'semver';
import cs from '../../console';

/**
 * 降级版本号
 * @param {semver.SemVer} pv 版本号
 * @param {number} dec 降级多少个版本
 * @returns {void} 无返回值
 */
const decrementVersion = (pv: semver.SemVer, dec: number): void => {
  while (dec > 0) {
    if (pv.patch > 0) {
      pv.patch--;
    } else if (pv.minor > 0) {
      pv.minor--;
      pv.patch = 9;
    } else if (pv.major > 0) {
      pv.major--;
      pv.minor = 9;
      pv.patch = 9;
    } else {
      return; // 已是最低版本，不再继续降级
    }
    dec--;
  }
};

/**
 * 降级预发布版本号
 * @param {semver.SemVer} parsedVersion 解析后的版本号
 * @param {number} n 降级多少个版本
 * @returns {void} 无返回值
 */
const decrementPreReleaseVersion = (parsedVersion: semver.SemVer, n: number): void => {
  while (n > 0 && parsedVersion.prerelease.length > 0) {
    const preReleaseParts = [...parsedVersion.prerelease];
    const lastIndex = preReleaseParts.length - 1;
    const lastPreReleasePart = preReleaseParts[lastIndex];

    if (typeof lastPreReleasePart === 'number' && lastPreReleasePart > 0) {
      const decrementValue = Math.min(lastPreReleasePart, n);
      preReleaseParts[lastIndex] = lastPreReleasePart - decrementValue;
      n -= decrementValue;
      if (preReleaseParts[lastIndex] === 0) {
        preReleaseParts.pop();
      }
    } else {
      preReleaseParts.pop();
      decrementVersion(parsedVersion, 1);
      n--;
    }

    parsedVersion.prerelease = preReleaseParts;
  }

  if (n > 0) {
    decrementVersion(parsedVersion, n);
  }
};

/**
 * 降级版本
 * @param {string} version 版本号
 * @param {number} n 降级多少个版本
 * @returns {string} 降级后的版本号
 */
const decrement: (version: string, n?: number) => string = (version, n = 1) => {
  const parsedVersion = semver.parse(version);

  if (!parsedVersion) {
    cs.error('无效的版本格式', 'Invalid version format');
    return '0.0.0'; // 对于无效版本，返回'0.0.0'
  }

  if (parsedVersion.prerelease.length && n > 0) {
    decrementPreReleaseVersion(parsedVersion, n);
  } else {
    decrementVersion(parsedVersion, n);
  }

  return parsedVersion.format();
};

export default decrement;
