import pc from 'picocolors';
import error from '.';

describe('@/utils/console/error/index.ts', () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log');
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('should print error messages in both Chinese and English', () => {
    const cn = '中文错误信息';
    const en = '英文错误信息';

    error(cn, en);

    expect(logSpy).toHaveBeenCalledWith(pc.red(`x ${cn}`));
    expect(logSpy).toHaveBeenCalledWith(pc.red(`x ${en}`));
  });
});
