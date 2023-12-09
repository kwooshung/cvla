import { ICommitScope } from '@/interface';

/**
 * 转换为commitlint格式
 * @param {ICommitScope[]} scope 类型
 * @returns {string[]} 转换后的 Scopes
 */
const toLintScopes = (scope: ICommitScope[]): string[] => scope.map((type: ICommitScope) => type.name);

export default toLintScopes;
