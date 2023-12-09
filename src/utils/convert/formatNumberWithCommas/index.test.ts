import formatNumberWithCommas from '.';

describe('@/utils/convert/formatNumberWithCommas/index.ts', () => {
  it('正确处理常规数字', () => {
    expect(formatNumberWithCommas(1234)).toBe('1,234');
  });

  it('正确处理大数字', () => {
    expect(formatNumberWithCommas(1234567890)).toBe('1,234,567,890');
  });

  it('能够处理数字字符串', () => {
    expect(formatNumberWithCommas('1234')).toBe('1,234');
  });

  it('能够处理边缘情况（如 0 和负数）', () => {
    expect(formatNumberWithCommas(0)).toBe('0');
    expect(formatNumberWithCommas(-1234)).toBe('-1,234');
  });

  it('处理小数', () => {
    expect(formatNumberWithCommas(1234.56)).toBe('1,234.56');
  });

  it('处理非数字字符串输入', () => {
    expect(() => formatNumberWithCommas('abc')).toThrow();
  });
});
