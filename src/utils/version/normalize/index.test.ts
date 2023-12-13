import normalize from '.';

describe('@/utils/version/normalize/index.ts', () => {
  // 测试用例1: 如果版本字符串已经以 "v" 开头，则应该保持不变
  it('如果版本字符串已经以 "v" 开头，则应该保持不变', () => {
    expect(normalize('v1.2.3')).toBe('v1.2.3');
  });

  // 测试用例2: 如果版本字符串没有以 "v" 开头，则应在前面添加 "v"
  it('如果版本字符串没有以 "v" 开头，则应在前面添加 "v"', () => {
    expect(normalize('1.2.3')).toBe('v1.2.3');
  });

  // 测试用例3: 对空字符串的处理
  it('对空字符串的处理，应添加 "v"', () => {
    expect(normalize('')).toBe('v');
  });

  it('如果 tag 为 true 且版本字符串已经以 "v" 开头，则应该移除 "v"', () => {
    expect(normalize('v1.2.3', true)).toBe('1.2.3');
  });

  it('如果 tag 为 true 且版本字符串没有以 "v" 开头，则应该保持不变', () => {
    expect(normalize('1.2.3', true)).toBe('1.2.3');
  });

  it('特殊字符或不规则输入的处理', () => {
    expect(normalize('v1.2.3-beta')).toBe('v1.2.3-beta');
    expect(normalize('1.2.3-beta')).toBe('v1.2.3-beta');
    expect(normalize('vxyz')).toBe('vxyz');
    expect(normalize('xyz', true)).toBe('xyz');
  });

  it('对 null 或 undefined 的处理', () => {
    expect(normalize(null)).toBe('v');
    expect(normalize(undefined)).toBe('v');
  });
});
