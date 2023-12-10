import { ICommitScope } from '@/interface';
import toLintScopes from '.';

describe('@/utils/convert/toLintScopes/index.ts', () => {
  it('应正确处理空数组', () => {
    const scopes: ICommitScope[] = [];
    const result = toLintScopes(scopes);
    expect(result).toEqual([]);
  });

  it('应从对象数组中提取 name 属性作为字符串数组', () => {
    const scopes: ICommitScope[] = [
      { name: 'type1', description: '描述1' },
      { name: 'type2', description: '描述2' },
      { name: 'type3', description: '描述3' }
    ];
    const result = toLintScopes(scopes);
    expect(result).toEqual(['type1', 'type2', 'type3']);
  });
});
