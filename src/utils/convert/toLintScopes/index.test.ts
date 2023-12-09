import { ICommitScope } from '@/interface';
import toLintScopes from '.';

describe('@/utils/convert/toLintScopes/index.ts', () => {
  it('应正确转换空对象', () => {
    const result = toLintScopes({});
    expect(result).toEqual([]);
  });

  it('应从对象中提取键作为字符串数组', () => {
    const types: ICommitScope = {
      type1: '描述1',
      type2: '描述2',
      type3: '描述3'
    };
    const result = toLintScopes(types);
    expect(result).toEqual(['type1', 'type2', 'type3']);
  });
});
