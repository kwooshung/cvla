import pc from 'picocolors';
import title from '.';

const logSpy = jest.spyOn(console, 'log');
const clearSpy = jest.spyOn(console, 'clear');

describe('@/utils/command/prompt/title/index.ts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('如果是第一个标题，应该清除控制台并输出标题', () => {
    const testTitle = '测试标题';
    title(testTitle, true);

    expect(clearSpy).toHaveBeenCalled();

    expect(logSpy).toHaveBeenCalledWith(`${pc.bold(pc.cyan(`----- [ ${testTitle} ] -----`))}\n`);
  });

  it('如果不是第一个标题，应该先输出换行再输出标题', () => {
    const testTitle = '另一个测试标题';
    title(testTitle);

    expect(logSpy).toHaveBeenCalledWith('\n');

    expect(logSpy).toHaveBeenCalledWith(`${pc.bold(pc.cyan(`----- [ ${testTitle} ] -----`))}\n`);
  });
});
