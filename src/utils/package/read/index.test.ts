import fs from 'fs';
import read from '.';

// 使用 jest.mock 来模拟 fs 模块
jest.mock('fs');
jest.mock('detect-indent', () => ({ default: () => ({ indent: '  ' }) }));

// 开始编写测试用例
describe('@/utils/package/read/index.ts', () => {
  // 定义一个样例的 package.json 内容和缩进
  const mockPackageJsonContent = `{
  "name": "test",
  "version": "1.0.0"
}`;

  beforeEach(() => (fs.readFileSync as jest.Mock).mockReturnValue(mockPackageJsonContent));

  afterEach(() => jest.clearAllMocks());

  it('在 package.json 文件包含无效 JSON 时应该抛出异常', () => {
    (fs.readFileSync as jest.Mock).mockReturnValue('invalid json');
    expect(() => read()).toThrow(SyntaxError);
  });

  it('在 package.json 文件不存在时应该抛出异常', () => {
    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('file not found');
    });

    expect(() => read()).toThrow('file not found');
  });

  it('处理空文件内容', () => {
    (fs.readFileSync as jest.Mock).mockReturnValue('');

    const result = read();

    expect(result).toEqual({
      data: false,
      indentation: '  '
    });
  });
});
