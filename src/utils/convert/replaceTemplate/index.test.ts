import replaceTemplate from '.';

describe('@/utils/convert/replaceTemplate/index.ts', () => {
  it('替换含有对应键的占位符', () => {
    const template = 'Hello, {{name}}!';
    const data = { name: 'Alice' };
    expect(replaceTemplate(template, data)).toBe('Hello, Alice!');
  });

  it('变量首字母大写', () => {
    const template = 'Hello, {{Name}}! Today is {{Day}}.';
    const data = { name: 'alice', day: 'monday' };
    expect(replaceTemplate(template, data)).toBe('Hello, Alice! Today is Monday.');
  });

  it('变量全大写', () => {
    const template = 'Hello, {{NAME}}! Today is {{DAY}}.';
    const data = { name: 'alice', day: 'monday' };
    expect(replaceTemplate(template, data)).toBe('Hello, ALICE! Today is MONDAY.');
  });

  it('变量功能：1个参数', () => {
    const template = 'https://github.com/kwooshung/cvlar/commit/{{id[substr: 7]}}';
    const data = { id: 'CB6F8ADFEC943A7B0E619F6AB30257CB0A19D8D1' };
    expect(replaceTemplate(template, data)).toBe('https://github.com/kwooshung/cvlar/commit/CB6F8AD');
  });

  it('1.变量功能：2个参数', () => {
    const template = 'https://github.com/kwooshung/cvlar/commit/{{id[substr:7, 3]}}';
    const data = { id: 'cb6f8adfec943a7b0e619f6ab30257cb0a19d8d1' };
    expect(replaceTemplate(template, data)).toBe('https://github.com/kwooshung/cvlar/commit/fec');
  });

  it('2.变量功能：2个参数', () => {
    const template = 'https://github.com/kwooshung/cvlar/commit/{{id[substr:7,3]}}';
    const data = { id: 'cb6f8adfec943a7b0e619f6ab30257cb0a19d8d1' };
    expect(replaceTemplate(template, data)).toBe('https://github.com/kwooshung/cvlar/commit/fec');
  });

  it('变量功能：1个参数，首字母大写', () => {
    const template = 'https://github.com/kwooshung/cvlar/commit/{{Id[substr:7]}}';
    const data = { id: 'cb6f8adfec943a7b0e619f6ab30257cb0a19d8d1' };
    expect(replaceTemplate(template, data)).toBe('https://github.com/kwooshung/cvlar/commit/Cb6f8ad');
  });

  it('变量功能：1个参数，全字母大写', () => {
    const template = 'https://github.com/kwooshung/cvlar/commit/{{ID[substr:7]}}';
    const data = { id: 'cb6f8adfec943a7b0e619f6ab30257cb0a19d8d1' };
    expect(replaceTemplate(template, data)).toBe('https://github.com/kwooshung/cvlar/commit/CB6F8AD');
  });

  it('1.变量功能：2个参数，首字母大写', () => {
    const template = 'https://github.com/kwooshung/cvlar/commit/{{Id[substr:7,3]}}';
    const data = { id: 'CB6F8ADFEC943A7B0E619F6AB30257CB0A19D8D1' };
    expect(replaceTemplate(template, data)).toBe('https://github.com/kwooshung/cvlar/commit/Fec');
  });

  it('2.变量功能：2个参数，首字母大写', () => {
    const template = 'https://github.com/kwooshung/cvlar/commit/{{ID[substr:7, 3]}}';
    const data = { id: 'CB6F8ADFEC943A7B0E619F6AB30257CB0A19D8D1' };
    expect(replaceTemplate(template, data)).toBe('https://github.com/kwooshung/cvlar/commit/FEC');
  });

  it('变量功能：参数不正确', () => {
    const template = 'https://github.com/kwooshung/cvlar/commit/{{ID[substr:a, b]}}';
    const data = { id: 'cb6f8adfec943a7b0e619f6ab30257cb0a19d8d1' };
    expect(replaceTemplate(template, data)).toBe('https://github.com/kwooshung/cvlar/commit/CB6F8ADFEC943A7B0E619F6AB30257CB0A19D8D1');
  });

  it('变量功能：参数个数不正确', () => {
    const template = 'https://github.com/kwooshung/cvlar/commit/{{ID[substr:1, 2, 3]}}';
    const data = { id: 'cb6f8adfec943a7b0e619f6ab30257cb0a19d8d1' };
    expect(replaceTemplate(template, data)).toBe('https://github.com/kwooshung/cvlar/commit/CB6F8ADFEC943A7B0E619F6AB30257CB0A19D8D1');
  });

  it('变量功能：没传参', () => {
    let template = 'https://github.com/kwooshung/cvlar/commit/{{id[substr]}}';
    const data = { id: 'cb6f8adfec943a7b0e619f6ab30257cb0a19d8d1' };

    expect(replaceTemplate(template, data)).toBe('https://github.com/kwooshung/cvlar/commit/cb6f8adfec943a7b0e619f6ab30257cb0a19d8d1');

    template = 'https://github.com/kwooshung/cvlar/commit/{{id[s]}}';
    expect(replaceTemplate(template, data)).toBe('https://github.com/kwooshung/cvlar/commit/cb6f8adfec943a7b0e619f6ab30257cb0a19d8d1');

    template = 'https://github.com/kwooshung/cvlar/commit/{{Id[s]}}';
    expect(replaceTemplate(template, data)).toBe('https://github.com/kwooshung/cvlar/commit/Cb6f8adfec943a7b0e619f6ab30257cb0a19d8d1');

    template = 'https://github.com/kwooshung/cvlar/commit/{{ID[s]}}';
    expect(replaceTemplate(template, data)).toBe('https://github.com/kwooshung/cvlar/commit/CB6F8ADFEC943A7B0E619F6AB30257CB0A19D8D1');

    template = 'https://github.com/kwooshung/cvlar/commit/{{id[]}}';
    expect(replaceTemplate(template, data)).toBe('https://github.com/kwooshung/cvlar/commit/cb6f8adfec943a7b0e619f6ab30257cb0a19d8d1');

    template = 'https://github.com/kwooshung/cvlar/commit/{{id}}';
    expect(replaceTemplate(template, data)).toBe('https://github.com/kwooshung/cvlar/commit/cb6f8adfec943a7b0e619f6ab30257cb0a19d8d1');
  });

  it('变量功能：参数不正确', () => {
    const template = 'https://github.com/kwooshung/cvlar/commit/{{id[substr]}}';
    const data = { id: 'cb6f8adfec943a7b0e619f6ab30257cb0a19d8d1' };
    expect(replaceTemplate(template, data)).toBe('https://github.com/kwooshung/cvlar/commit/cb6f8adfec943a7b0e619f6ab30257cb0a19d8d1');
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
