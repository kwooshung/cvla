import exists from '../exists';
import remove from '../remove';
import read from '../read';
import write from '../write';
import copy from '.';

describe('@/utils/io/copy/index.ts', () => {
  const sourceFile = 'testSource.txt';
  const targetFile = 'testTarget.txt';
  const testContent = '测试复制内容';

  beforeEach(async () => {
    // 创建源文件
    await write(sourceFile, testContent);
  });

  afterEach(async () => {
    // 清理：删除测试文件
    if (await exists(sourceFile)) {
      await remove(sourceFile);
    }
    if (await exists(targetFile)) {
      await remove(targetFile);
    }
  });

  it('成功复制文件内容', async () => {
    const result = await copy(sourceFile, targetFile);
    expect(result).toBe(true);
    const content = await read(targetFile);
    expect(content).toBe(testContent);
  });

  it('尝试复制到同一位置，什么都不处理，也应该是成功', async () => {
    const result = await copy(sourceFile, sourceFile);
    expect(result).toBe(true);
  });

  it('复制到已存在的文件应失败', async () => {
    await write(targetFile, '已存在的内容');
    const result = await copy(sourceFile, targetFile);
    expect(result).toBe(false);
  });
});
