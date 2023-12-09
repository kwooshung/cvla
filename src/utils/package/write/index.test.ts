import fs from 'fs';
import write from '.';

// 使用 jest.mock 来模拟 fs 模块
jest.mock('fs');

// 开始编写测试用例
describe('@/utils/package/write/index.ts', () => {
  // 定义一个样例的 package.json 内容和缩进
  const mockPackageJsonContent = `{
  "name": "test",
  "version": "1.0.0"
}`;
  const mockPackageJson = {
    data: {
      name: 'test',
      version: '1.0.0'
    },
    indentation: '  '
  };

  // 在每个测试用例开始前，设置 fs.readFileSync 的模拟实现
  beforeEach(() => {
    (fs.readFileSync as jest.Mock).mockReturnValue(mockPackageJsonContent);
  });

  // 清除所有模拟实现和实例
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 测试 write 函数
  it('应该正确地将数据写回 package.json 文件', () => {
    // 设置 fs.writeFileSync 的模拟实现
    const writeFileSyncMock = (fs.writeFileSync as jest.Mock).mockImplementation();

    // 调用 write
    write(mockPackageJson);

    // 验证 fs.writeFileSync 是否被正确调用
    expect(writeFileSyncMock).toHaveBeenCalledWith('./package.json', JSON.stringify(mockPackageJson.data, null, mockPackageJson.indentation));
  });

  // 测试 write 在遇到写入错误时的表现
  it('在写入 package.json 文件时遇到错误应该抛出异常', () => {
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('write error');
    });

    expect(() => write(mockPackageJson)).toThrow('write error');
  });
});
