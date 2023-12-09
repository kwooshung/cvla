import all from '.';

describe('@/utils/console/clear/all/index.ts', () => {
  beforeEach(() => {
    // 在每个测试开始前清除所有模拟的调用信息
    jest.clearAllMocks();
  });

  it('应当调用 console.clear 清空控制台', () => {
    // 模拟 console.clear
    jest.spyOn(console, 'clear').mockImplementation(() => {});

    all(); // 调用 all 函数

    // 验证 console.clear 是否被调用
    expect(console.clear).toHaveBeenCalledTimes(1);
  });
});
