import lastline from '.';

describe('@/utils/console/clear/lastline/index.ts', () => {
  const originalWrite = process.stdout.write;
  let output: any;

  beforeEach(() => {
    output = [];
    process.stdout.write = jest.fn((text) => output.push(text));
  });

  afterEach(() => {
    process.stdout.write = originalWrite;
  });

  it('默认情况下应当使用 ANSI 转义序列清除上一行', () => {
    lastline();
    expect(output).toEqual(['\x1b[1A\x1b[K']);
  });

  it('传入参数时应当清除指定数量的行', () => {
    lastline(3);
    expect(output).toEqual(['\x1b[1A\x1b[K', '\x1b[1A\x1b[K', '\x1b[1A\x1b[K']);
  });
});
