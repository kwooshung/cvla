import push from '.';

describe('@/utils/git/push/index.ts', () => {
  it('force 参数为 false 时应返回标准推送命令', () => {
    const command = push();
    expect(command).toBe('git push');
  });

  it('force 参数为 true 时应返回包含 --force 的推送命令', () => {
    const command = push(true);
    expect(command).toBe('git push --force');
  });
});
