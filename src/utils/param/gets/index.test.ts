import gets from '.';

describe('@/utils/param/gets/index.ts', () => {
  const originalArgv = process.argv;

  beforeEach(() => {
    process.argv = [...originalArgv];
  });

  afterEach(() => {
    process.argv = originalArgv;
  });

  it('应该能够正确获取多个存在的参数值', () => {
    process.argv.push('-param1', 'value1', '-param2', 'value2');

    const param = gets(['param1', 'param2']);
    expect(param).toEqual({ param1: 'value1', param2: 'value2' });
  });

  it('如果某些参数不存在，应该为这些参数返回空字符串', () => {
    process.argv.push('-param1', 'value1');

    const param = gets(['param1', 'nonexistentParam']);
    expect(param).toEqual({ param1: 'value1', nonexistentParam: '' });
  });

  it('应该能够正确处理包含空格的参数值', () => {
    process.argv.push('-param1', 'value with', 'spaces', '-param2', 'value2');

    const param = gets(['param1', 'param2']);
    expect(param).toEqual({ param1: 'value with spaces', param2: 'value2' });
  });

  it('如果没有给定参数，则应返回空对象', () => {
    const param = gets([]);
    expect(param).toEqual({});
  });
});
