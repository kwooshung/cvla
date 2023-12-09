import exists from '../exists';
import remove from '../remove';
import read from '../read';
import write from '.';

describe('@/utils/io/write/index.ts', () => {
  const testFile = 'testWrite.txt';
  const testContent = '测试写入内容';

  afterEach(async () => {
    // 清理：删除测试文件
    if (await exists(testFile)) {
      await remove(testFile);
    }
  });

  it('成功写入文件内容', async () => {
    await write(testFile, testContent);
    const content = await read(testFile);
    expect(content).toBe(testContent);
  });

  it('文件已存在且不允许覆盖时应返回 false', async () => {
    // 首先创建文件
    await write(testFile, testContent);
    // 尝试再次写入相同文件，不允许覆盖
    const result = await write(testFile, '新内容', false);
    expect(result).toBe(false);
  });
});
