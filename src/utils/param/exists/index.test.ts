import exists from '.';

describe('@/utils/param/exists/index.ts', () => {
  let originalArgv: string[];

  beforeEach(() => {
    originalArgv = process.argv.slice();
  });

  afterEach(() => {
    process.argv = originalArgv;
  });

  it('存在带短横线前缀的简写参数时返回 true', () => {
    process.argv = ['node', 'script.js', '-v'];
    expect(exists(['v', 'version'])).toBe(true);
  });

  it('存在带双短横线前缀的完整参数时返回 true', () => {
    process.argv = ['node', 'script.js', '--version'];
    expect(exists(['v', 'version'])).toBe(true);
  });

  it('简写和完整形式的参数都不存在时返回 false', () => {
    process.argv = ['node', 'script.js'];
    expect(exists(['v', 'version'])).toBe(false);
  });

  it('仅存在简写形式的参数时返回 true', () => {
    process.argv = ['node', 'script.js', '-v'];
    expect(exists(['v', 'somethingElse'])).toBe(true);
  });

  it('仅存在完整形式的参数时返回 true', () => {
    process.argv = ['node', 'script.js', '--version'];
    expect(exists(['somethingElse', 'version'])).toBe(true);
  });

  it('传入非两个元素的数组时返回 false 并记录错误', () => {
    process.argv = ['node', 'script.js', '-v'];
    expect(exists(['v'])).toBe(false);
  });
});
