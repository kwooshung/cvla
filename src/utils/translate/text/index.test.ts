import text from '.';
import Languages from '../lang';

describe('@/utils/translate/text/index.ts', () => {
  it('应该正确翻译 英文 到 简体中文', async () => {
    const result = await text('Hello', Languages.chineseSimplified, Languages.english);
    expect(result).toBe('你好');
  });

  it('如果没有指定源语言和目标语言，应该默认翻译 简体中文 到 英文', async () => {
    const result = await text('世界');
    expect(result.toLowerCase()).toBe('world');
  });

  it('如果翻译内容，目标语言和源语言一致，则不翻译，直接返回', async () => {
    const result = await text('世界', Languages.chineseSimplified, Languages.chineseSimplified);
    expect(result).toBe('世界');
  });

  it('应该正确翻译 英文 到 法文，对象方式', async () => {
    const result = await text('Hello', Languages.french, Languages.english);
    expect(result.toLowerCase()).toBe('bonjour');
  });

  it('应该正确翻译 英文 到 法文，字符串方式', async () => {
    const result = await text('Hello', 'fr', 'en');
    expect(result.toLowerCase()).toBe('bonjour');
  });

  it('应该正确翻译 简体中文 到 繁体中文（台湾）', async () => {
    const result = await text('好好学习，天天向上', Languages.chineseTraditionalTW, Languages.chineseSimplified);
    expect(result.toLowerCase()).toBe('好好學習，天天向上');
  });
});
