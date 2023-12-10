/**
 * 推送到远程仓库
 * @param force 是否强制推送，如果为 true 则使用 --force 参数；使用一定要小心，因为这会覆盖远程仓库的内容，也不会保留远程仓库的历史记录和状态，可能会导致其他人的代码丢失，所以请谨慎使用
 * @returns {string[]} 推送命令
 */
const push = (force: boolean = false): string[] => {
  const code = ['push'];
  force && code.push('--force');
  return code;
};

export default push;
