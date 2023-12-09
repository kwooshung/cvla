import format from '.';

describe('@/core/init/questions/save/comment/format/index.ts', () => {
  it('空注释应返回空字符串', () => {
    expect(format('', '  ')).toBe('');
  });

  it('单行注释应正确格式化', () => {
    const comment = '这是一个单行注释';
    const expected = '  // 这是一个单行注释\n';
    expect(format(comment, '  ')).toBe(expected);
  });

  it('带有换行符的单行注释，应该能够正确格式化为多行注释', () => {
    const comment = '这是多行注释\n这是第二行';
    const expected = '  /**\n   * 这是多行注释\n   * 这是第二行\n   */\n';
    expect(format(comment, '  ')).toBe(expected);
  });

  it('使用数组的注释，应该能够正确格式化为多行注释', () => {
    const comment = ['这是多行注释', '这是第二行'];
    const expected = '  /**\n   * 这是多行注释\n   * 这是第二行\n   */\n';
    expect(format(comment, '  ')).toBe(expected);
  });
});
