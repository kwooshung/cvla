import { ILanguage } from '@/interface';
import { GoogleTranslator } from '@translate-tools/core/translators/GoogleTranslator/index.js';
import Languages from '../lang';
// import { YandexTranslator } from '@translate-tools/core/translators/YandexTranslator/index.js';

/**
 * Google 翻译器
 * @type {GoogleTranslator}
 */
const google: GoogleTranslator = new GoogleTranslator();

/**
 * Yandex 翻译器
 */
// const yandex: YandexTranslator = new YandexTranslator();

/**
 * 翻译文本 > 中文翻译为英文
 * @param {string} text 要翻译的文本
 * @param {string|ILanguage} [to = Languages.english] 目标语言
 * @param {string|ILanguage} [from = Languages.chineseSimplified]  源语言
 * @returns {Promise<string>} 翻译后的文本
 */
const text = async (text: string, to: string | ILanguage = Languages.english, from: string | ILanguage = Languages.chineseSimplified): Promise<string> => {
  if (!text) return text;

  const _to = typeof to === 'string' ? to : to.code;
  const _from = typeof from === 'string' ? from : from.code;
  return _from === _to ? text : await google.translate(text, _from, _to);
};

export default text;
