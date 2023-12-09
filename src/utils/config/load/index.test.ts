import load from '.';

jest.mock('cosmiconfig');

describe('@/utils/config/load/index.ts', () => {
  it('应当成功加载配置文件', async () => {
    const mockConfigPath = '/path/to/mock/config.js';
    const mockConfigContent = { key: 'value' };

    jest.mock('cosmiconfig');
    const { cosmiconfig } = require('cosmiconfig');
    cosmiconfig.mockImplementation(() => {
      return {
        search: jest.fn(() => Promise.resolve({ config: mockConfigContent, filepath: mockConfigPath }))
      };
    });

    const result = await load();

    expect(result).toEqual({ config: mockConfigContent, path: mockConfigPath });
  });

  it('应当返回 false 如果未找到配置文件', async () => {
    jest.mock('cosmiconfig');
    const { cosmiconfig } = require('cosmiconfig');
    cosmiconfig.mockImplementation(() => {
      return {
        search: jest.fn(() => Promise.resolve(null))
      };
    });

    const result = await load();

    expect(result).toBe(false);
  });
});
