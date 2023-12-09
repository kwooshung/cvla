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

  it('应当使用 ANSI 转义序列清除上一行', () => {
    lastline();
    expect(output).toEqual(['\x1b[1A\x1b[K']);
  });
});
