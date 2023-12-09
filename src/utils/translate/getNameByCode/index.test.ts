import Languages from '../lang';
import getNameByCode from '.';

describe('@/utils/translate/getNameByCode/index.ts', () => {
  it('应正确找到存在的语言代码 - 大写', () => {
    expect(getNameByCode('EN')).toBe('English');
  });

  it('应正确找到存在的语言代码 - 小写', () => {
    expect(getNameByCode('en')).toBe('English');
  });

  it('应正确处理不存在的语言代码', () => {
    expect(getNameByCode('xyz')).toBe(Languages.chineseSimplified.name);
  });
});
