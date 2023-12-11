import push from '.';

describe('@/utils/git/push/index.ts', () => {
  it('默认值应返回标准推送命令', () => {
    const command = push();
    expect(command).toEqual(['push']);
  });

  it('tags 参数为 true 时应返回包含 --tags 的推送命令', () => {
    const command = push(true);
    expect(command).toEqual(['push', '--tags']);
  });

  it('force 参数为 true 时应返回包含 --force 的推送命令', () => {
    const command = push(false, true);
    expect(command).toEqual(['push', '--force']);
  });

  it('tags 和 force 参数都为 true 时应该返回包含 --tags --force 的推送命令', () => {
    const command = push(true, true);
    expect(command).toEqual(['push', '--tags', '--force']);
  });
});
