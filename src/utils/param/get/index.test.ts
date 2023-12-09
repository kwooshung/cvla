import get from '.';

describe('@/utils/param/get/index.ts', () => {
  const originalArgv = process.argv;

  beforeEach(() => {
    process.argv = [...originalArgv];
  });

  afterEach(() => {
    process.argv = originalArgv;
  });

  it('应该能够正确获取存在的参数值（单破折号）', () => {
    process.argv.push('-testKey', 'testValue');

    const value = get('testKey');
    expect(value).toBe('testValue');
  });

  it('应该能够正确获取存在的参数值（双破折号）', () => {
    process.argv.push('--testKey', 'testValue');

    const value = get('testKey');
    expect(value).toBe('testValue');
  });

  it('如果参数不存在，应该返回空字符串', () => {
    const value = get('nonexistentKey');
    expect(value).toBe('');
  });

  it('应该能够正确处理包含空格的参数值', () => {
    process.argv.push('-testKey', 'value with', 'spaces');

    const value = get('testKey');
    expect(value).toBe('value with spaces');
  });

  it('应该能够正确获取字符串数组中第一个存在的参数值', () => {
    process.argv.push('-testKey1', 'value1', '-testKey2', 'value2');

    const value = get(['nonexistentKey', 'testKey1', 'testKey2']);
    expect(value).toBe('value1');
  });

  it('如果字符串数组中的所有参数都不存在，应该返回空字符串', () => {
    const value = get(['nonexistentKey1', 'nonexistentKey2']);
    expect(value).toBe('');
  });

  it('应该忽略后续的参数键', () => {
    process.argv.push('-testKey', 'value', '-nextKey');

    const value = get('testKey');
    expect(value).toBe('value');
  });
});
