import delay from '.';

describe('@/utils/translate/delay/index.ts', () => {
  it('应该在指定的时间后解决', async () => {
    const ms = 100; // 指定延迟的毫秒数
    const startTime = Date.now();
    await delay(ms);
    const endTime = Date.now();
    const duration = endTime - startTime;

    // 验证延迟是否在预期时间范围内
    expect(duration).toBeGreaterThanOrEqual(ms);
  });

  it('如果没有指定时间，则默认延迟 10 毫秒', async () => {
    const startTime = Date.now();
    await delay();
    const endTime = Date.now();
    const duration = endTime - startTime;

    // 验证默认延迟是否在预期时间范围内
    expect(duration).toBeGreaterThanOrEqual(10);
  });
});
