import https from 'https';
import check from '.';

jest.mock('https');

describe('@/utils/translate/check/index.ts', () => {
  it('应当在可访问时返回 true', async () => {
    (https.get as jest.Mock).mockImplementation((url, callback) => {
      callback({ statusCode: 200 });
      return { on: jest.fn(), end: jest.fn() };
    });

    await expect(check(5000)).resolves.toBe(true);
  });

  it('应当在不可访问时返回 false', async () => {
    (https.get as jest.Mock).mockImplementation((url, callback) => {
      callback({ statusCode: 500 });
      return { on: jest.fn(), end: jest.fn() };
    });

    await expect(check(5000)).resolves.toBe(false);
  });

  it('应当在超时时返回 false', async () => {
    jest.useFakeTimers();
    (https.get as jest.Mock).mockImplementation(() => {
      return {
        on: jest.fn(),
        end: jest.fn(),
        destroy: jest.fn()
      };
    });

    const checkPromise = check(100);
    jest.advanceTimersByTime(150);
    await expect(checkPromise).resolves.toBe(false);

    jest.useRealTimers();
  });

  it('应当在网络错误时返回 false', async () => {
    (https.get as jest.Mock).mockImplementation(() => {
      return {
        on: (event: string, handler: (arg0: Error) => any) => {
          if (event === 'error') {
            process.nextTick(() => handler(new Error('模拟的网络错误')));
          }
        },
        end: jest.fn()
      };
    });

    await expect(check(5000)).resolves.toBe(false);
  });

  it('应当在没有 destroy 方法且模拟调用 abort 方法时返回 false', async () => {
    (https.get as jest.Mock).mockImplementation(() => {
      const mockReq = {
        on: (event: string, handler: (arg0: Error) => any) => {
          if (event === 'error') {
            process.nextTick(() => handler(new Error('模拟的 abort 错误')));
          }
        },
        end: jest.fn(),
        abort: jest.fn(() => {
          mockReq.on('error', null);
        })
      };
      return mockReq;
    });

    jest.useFakeTimers();
    const checkPromise = check(100);
    jest.advanceTimersByTime(150);
    await expect(checkPromise).resolves.toBe(false);
    jest.useRealTimers();
  });
});
