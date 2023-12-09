import { ILanguage } from '@/interface';
import { translate } from '@/utils';

// 默认使用中文
let currentLocale: ILanguage = translate.lang.chineseSimplified;

/**
 * 设置语言
 * @param {ILanguage} lang 语言
 */
const set = (lang: ILanguage) => {
  currentLocale = lang;
};

/**
 * 获取语言
 */
const get = (): ILanguage => currentLocale;

export { set, get };
