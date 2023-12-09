import { ICommitScope } from '@/interface';

/**
 * 转换为commitlint格式
 * @param {ICommitScope} types 类型
 * @returns {string[]} 转换后的 Scopes
 */
const toLintScopes = (types: ICommitScope): string[] => Object.keys(types);

export default toLintScopes;
