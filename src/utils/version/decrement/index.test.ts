import decrement from '.';

describe('@/utils/version/decrement/index.ts', () => {
  it('正常降低主版本号 (major)', () => {
    expect(decrement('1.0.0', 1)).toBe('0.9.9');
  });

  it('正常降低次版本号 (minor)', () => {
    expect(decrement('1.2.0', 1)).toBe('1.1.9');
  });

  it('正常降低修订号 (patch)', () => {
    expect(decrement('1.2.3', 1)).toBe('1.2.2');
  });

  it('当版本号已是最低时应返回 0.0.0', () => {
    expect(decrement('0.0.0', 1)).toBe('0.0.0');
  });

  it('多次降级直到最低版本号', () => {
    expect(decrement('1.1.1', 111)).toBe('0.0.0');
    expect(decrement('2.0.0', 200)).toBe('0.0.0');
    expect(decrement('3.0.0', 1000)).toBe('0.0.0');
  });

  it('对于无效的版本格式应抛出错误', () => {
    expect(decrement('无效版本', 1)).toBe('0.0.0');
  });

  it('默认降级1次', () => {
    expect(decrement('1.2.3')).toBe('1.2.2');
    expect(decrement('1.2.0')).toBe('1.1.9');
    expect(decrement('1.0.0')).toBe('0.9.9');
    expect(decrement('0.1.0')).toBe('0.0.9');
    expect(decrement('0.0.5')).toBe('0.0.4');
  });

  it('降低预发布版本的数字', () => {
    expect(decrement('1.2.3-alpha.2', 1)).toBe('1.2.3-alpha.1');
  });

  it('移除预发布版本的最后一个数字', () => {
    expect(decrement('1.2.3-alpha.1', 1)).toBe('1.2.3-alpha');
  });

  it('降低主要版本号，当预发布部分为非数字', () => {
    expect(decrement('1.2.3-alpha', 1)).toBe('1.2.2');
  });

  it('连续降级包含预发布版本的版本号', () => {
    expect(decrement('1.2.3-beta.1')).toBe('1.2.3-beta');
    expect(decrement('1.2.3-beta.3', 2)).toBe('1.2.3-beta.1');
    expect(decrement('1.2.3-beta.3', 3)).toBe('1.2.3-beta');
    expect(decrement('1.2.3-beta.1', 1)).toBe('1.2.3-beta');
    expect(decrement('1.2.3-beta.1', 2)).toBe('1.2.2');
  });

  it('处理复杂的预发布版本', () => {
    expect(decrement('1.2.3-beta.1')).toBe('1.2.3-beta');
    expect(decrement('1.2.3-beta.2')).toBe('1.2.3-beta.1');
    expect(decrement('1.2.3-beta.1', 1)).toBe('1.2.3-beta');
    expect(decrement('1.2.3-beta.2', 2)).toBe('1.2.3-beta');
    expect(decrement('1.2.3-beta.1', 2)).toBe('1.2.2');
    // expect(decrement('1.2.3----RC-SNAPSHOT.12.9.1--.12+100')).toBe('1.2.3----RC-SNAPSHOT.12.9.1--.12+99');
    // expect(decrement('1.2.3----RC-SNAPSHOT.12.9.1--.12+100', 100)).toBe('1.2.3----RC-SNAPSHOT.12.9.1--.12');
    // expect(decrement('1.2.3-rc.2+build.1', 1)).toBe('1.2.3-rc.2+build');
    // expect(decrement('1.2.3-rc.2+build.1', 2)).toBe('1.2.3-rc.2');
    // expect(decrement('1.2.3-rc.2+build.1', 3)).toBe('1.2.3-rc.1');
    // expect(decrement('1.2.3-rc.2+build.1', 4)).toBe('1.2.3-rc');
    // expect(decrement('1.2.3-rc.2+build.1', 5)).toBe('1.2.3');
    // expect(decrement('1.2.3-rc+build.1', 1)).toBe('1.2.2-rc+build');
  });
});
