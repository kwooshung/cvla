import { set as setLang } from '../_state';
import { ILanguage } from '@/interface';
/**
 * 设置语言
 * @param {ILanguage} lang 语言
 */
const set = (lang: ILanguage): void => {
  setLang(lang);
};

export default set;
