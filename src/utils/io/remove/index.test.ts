import path from 'path';
import exists from '../exists';
import write from '../write';
import createDir from '../createDir';
import remove from '.';

describe('@/utils/io/remove/index.ts', () => {
  const testDirRoot = 'testRemoveDir';

  // 创建测试目录和文件的辅助函数
  const setupTestDir = async (subDirs: string[], files: string[]) => {
    await createDir(testDirRoot);
    for (const dir of subDirs) {
      await createDir(path.join(testDirRoot, dir));
    }
    for (const file of files) {
      await write(path.join(testDirRoot, file), 'test data');
    }
  };

  afterAll(async () => {
    await remove(testDirRoot, true);
  });

  it('应当成功删除一个空目录', async () => {
    await createDir(testDirRoot);
    const result = await remove(testDirRoot);
    expect(result).toBe(true);
    expect(await exists(testDirRoot)).toBe(false);
  });

  it('应当成功删除一个含有文件的目录', async () => {
    await setupTestDir([], ['test.txt']);
    const result = await remove(testDirRoot);
    expect(result).toBe(true);
    expect(await exists(testDirRoot)).toBe(false);
  });

  it('应当成功含有多个文件的目录', async () => {
    await setupTestDir([], ['test1.txt', 'test2.txt']);
    const result = await remove(testDirRoot);
    expect(result).toBe(true);
    expect(await exists(testDirRoot)).toBe(false);
  });

  it('应当成功删除一个含有子目录和文件的目录', async () => {
    await setupTestDir(['subDir'], ['test.txt', 'subDir/subTest.txt']);
    const result = await remove(testDirRoot, true);
    expect(result).toBe(true);
    expect(await exists(testDirRoot)).toBe(false);
  });
});
