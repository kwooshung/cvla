import semver from 'semver';
import { IPackagesVersions } from '@/interface';

/**
 * 函数：查找最高可升级版本
 * @param {string} currentVersion 当前版本号
 * @param {string} latestVersion 最新版本号
 * @param {string[]} versions 版本号列表
 * @returns {IPackagesVersions} 可升级版本信息
 */
const findHighestUpgradable = (currentVersion: string, latestVersion: string, versions: string[]): IPackagesVersions => {
  const info: IPackagesVersions = {
    current: {
      version: currentVersion,
      standard: false
    },
    major: {
      version: currentVersion,
      standard: false
    },
    minor: {
      version: currentVersion,
      standard: false
    },
    patch: {
      version: currentVersion,
      standard: false
    },
    prerelease: {
      version: currentVersion,
      standard: false
    },
    missing: false,
    no: true
  };

  const currentVersionMatch = currentVersion.match(
    /(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?/
  );

  // 提取纯净的版本号
  if (currentVersionMatch?.length) {
    currentVersion = currentVersionMatch[0];
  }

  try {
    info.current.version = currentVersion;

    // 检查是否是最新版本
    if (currentVersion === latestVersion) {
      info.major.version = currentVersion;
      info.minor.version = currentVersion;
      info.patch.version = currentVersion;
    } else {
      info.no = false;

      // 筛选出稳定版本
      const stableVersions = versions.filter((v) => semver.prerelease(v) === null);

      // 获取整个列表中的最新稳定版本
      info.major.version = stableVersions.sort(semver.rcompare)[0] || currentVersion;

      // 获取当前主版本号下的最新稳定版本
      const majorVersion = semver.major(currentVersion);
      const minorVersions = stableVersions.filter((v) => semver.major(v) === majorVersion);
      info.minor.version = minorVersions.sort(semver.rcompare)[0] || currentVersion;

      // 获取当前主和次版本号下的最新稳定补丁版本
      const minorVersion = semver.minor(currentVersion);
      const patchVersions = stableVersions.filter((v) => semver.major(v) === majorVersion && semver.minor(v) === minorVersion);
      info.patch.version = patchVersions.sort(semver.rcompare)[0] || currentVersion;

      // 筛选出所有预发布版本
      const prereleaseVersions = versions.filter((v) => semver.prerelease(v));

      // 从预发布版本中找出低于最新稳定版本的最新预发布版本
      const latestStableVersion = info.major.version; // 使用已经找到的最新稳定版本
      const eligiblePrereleaseVersions = prereleaseVersions.filter((v) => semver.lt(v, latestStableVersion));
      info.prerelease.version = semver.maxSatisfying(eligiblePrereleaseVersions, '*') || currentVersion;
    }

    // 检查是否是标准的版本号
    info.current.standard = semver.valid(info.current.version) !== null;
    info.major.standard = semver.valid(info.major.version) !== null;
    info.minor.standard = semver.valid(info.minor.version) !== null;
    info.patch.standard = semver.valid(info.patch.version) !== null;
    info.prerelease.standard = semver.valid(info.prerelease.version) !== null;
  } catch (e) {
    info.no = false;
    // 如果出现错误，而且当前版本号，不是最新版本号，则使用最新版本号
    if (currentVersion !== latestVersion) {
      info.major.version = latestVersion;
      info.minor.version = latestVersion;
      info.patch.version = latestVersion;
      info.prerelease.version = latestVersion;

      info.major.standard = true;
      info.minor.standard = true;
      info.patch.standard = true;
      info.prerelease.standard = true;
      info.no = true;
    }
  }

  return info;
};

export default findHighestUpgradable;
