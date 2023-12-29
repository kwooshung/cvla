import exists from '../exists';
import remove from '../remove';
import read from '../read';
import write from '../write';
import move from '.';

describe('@/utils/io/move/index.ts', () => {
  const sourceFile = 'testSource.txt';
  const targetFile = 'testTarget.txt';
  const testContent = '测试移动内容';

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

  it('成功移动文件', async () => {
    const result = await move(sourceFile, targetFile);
    expect(result).toBe(true);
    const content = await read(targetFile);
    expect(content).toBe(testContent);
    const sourceExists = await exists(sourceFile);
    expect(sourceExists).toBe(false);
  });

  it('移动到已存在的文件应失败', async () => {
    await write(targetFile, '已存在的内容');
    const result = await move(sourceFile, targetFile);
    expect(result).toBe(false);
  });

  it('源文件不存在时应返回 false', async () => {
    const nonExistingFile = 'nonExistingFile.txt';
    const result = await move(nonExistingFile, targetFile);
    expect(result).toBe(false);
  });

  it('目标路径是目录时应返回 false', async () => {
    const targetDir = 'testTargetDir';
    const result = await move(sourceFile, targetDir);
    expect(result).toBe(false);
    await remove(targetDir);
  });
});
