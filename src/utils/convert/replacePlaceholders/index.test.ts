import replacePlaceholders from '.';

describe('@/utils/convert/replacePlaceholders/index.ts', () => {
  it('正确替换单个占位符', () => {
    expect(replacePlaceholders('Hello, {0}!', 'World')).toBe('Hello, World!');
  });

  it('正确处理多个占位符', () => {
    expect(replacePlaceholders('{0} + {1} = {2}', '1', '1', '2')).toBe('1 + 1 = 2');
  });

  it('处理重复的占位符', () => {
    expect(replacePlaceholders('{0} and {0}', 'Hello')).toBe('Hello and Hello');
  });

  it('处理空字符串和无占位符的情况', () => {
    expect(replacePlaceholders('', 'World')).toBe('');
    expect(replacePlaceholders('Hello, World!', 'World')).toBe('Hello, World!');
  });

  it('处理占位符超出参数范围的情况', () => {
    expect(replacePlaceholders('Hello, {1}!', 'World')).toBe('Hello, !');
  });

  it('处理混合类型的参数', () => {
    expect(replacePlaceholders('{0} is {1} years old.', 'Alice', 30)).toBe('Alice is 30 years old.');
  });
});
