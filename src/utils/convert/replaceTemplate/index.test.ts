import replaceTemplate from '.';

describe('@/utils/convert/replaceTemplate/index.ts', () => {
  it('替换含有对应键的占位符', () => {
    const template = 'Hello, {{name}}!';
    const data = { name: 'Alice' };
    expect(replaceTemplate(template, data)).toBe('Hello, Alice!');
  });

  it('保留没有对应键的占位符', () => {
    const template = 'Hello, {{name}}! Today is {{day}}.';
    const data = { name: 'Alice' };
    expect(replaceTemplate(template, data)).toBe('Hello, Alice! Today is {{day}}.');
  });

  it('处理空字符串模板', () => {
    const template = '';
    const data = { name: 'Alice' };
    expect(replaceTemplate(template, data)).toBe('');
  });

  it('处理空对象', () => {
    const template = 'Hello, {{name}}!';
    const data = {};
    expect(replaceTemplate(template, data)).toBe('Hello, {{name}}!');
  });

  it('处理不存在的占位符', () => {
    const template = 'Hello, World!';
    const data = { name: 'Alice' };
    expect(replaceTemplate(template, data)).toBe('Hello, World!');
  });
});
