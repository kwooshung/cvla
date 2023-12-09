import fs from 'fs';
import read from '.';

describe('@/utils/io/read/index.ts', () => {
  it('读取文件内容', async () => {
    const testContent = '测试内容';
    const testFile = 'test.txt';

    fs.writeFileSync(testFile, testContent);
    const content = await read(testFile);
    expect(content).toBe(testContent);

    fs.unlinkSync(testFile);
  });
});
