import { ICommitType } from '@/interface';

/**
 * 转换为commitlint格式
 * @param {ICommitType[]} types 类型
 * @returns {ICommitLintType[]} 转换后的 Types
 */
const toLintType = (types: ICommitType[]): string[] => types.map((type: ICommitType) => `${type.emoji}${type.name}`);

export default toLintType;
