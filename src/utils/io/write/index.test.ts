import exists from '../exists';
import remove from '../remove';
import read from '../read';
import write from '.';

describe('@/utils/io/write/index.ts', () => {
  const testFile = 'testWrite.txt';
  const testContent = '测试写入内容';
  const appendContent = '追加的内容';

  afterEach(async () => {
    // 清理：删除测试文件
    if (await exists(testFile)) {
      await remove(testFile);
    }
  });

  it('成功写入文件内容', async () => {
    await write(testFile, testContent, false, true);
    const content = await read(testFile);
    expect(content).toBe(testContent);
  });

  it('文件已存在，不追加且不覆盖时应返回 false', async () => {
    // 首先创建文件
    await write(testFile, testContent, false, true);
    // 尝试再次写入相同文件，不允许覆盖且不追加
    const result = await write(testFile, '新内容');
    expect(result).toBe(false);
  });

  it('文件已存在时，在末尾追加内容', async () => {
    // 首先创建文件
    await write(testFile, testContent, false, true);
    // 追加内容到文件
    await write(testFile, appendContent, true);
    // 读取文件内容
    const content = await read(testFile);
    expect(content).toBe(testContent + appendContent);
  });

  it('文件不存在时，append 应创建文件并写入内容', async () => {
    // 文件不存在，使用 append 写入
    await write(testFile, testContent, true);
    // 读取文件内容
    const content = await read(testFile);
    expect(content).toBe(testContent);
  });
});
