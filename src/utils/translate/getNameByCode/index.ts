import Languages from '../lang';

/**
 * 根据语言代码获取语言名称
 * @param code 语言代码
 * @returns {string} 语言名称
 */
const getNameByCode = (code: string): string => {
  const searchCode = code.toLowerCase();
  const language = Object.values(Languages).find((lang) => lang.code.toLowerCase() === searchCode);
  return language ? language.name : Languages.chineseSimplified.name;
};

export default getNameByCode;
