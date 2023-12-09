import { ICommitType } from '@/interface';
import conf from '@/utils/config/def/types/zh-CN';
import toLintType from '.';

describe('@/convert/toLintType/index.ts', () => {
  it('正确转换 commintlint 配置项 type-enum 数组', () => {
    const expected = conf.map((type: ICommitType) => `${type.emoji ?? ''}${type.name}`);
    const result = toLintType(conf);

    expect(result).toEqual(expected);
  });

  it('emoji 为空时，不显示 emoji', () => {
    const commitType: ICommitType[] = [
      { emoji: '', name: '初始', description: '初始提交' },
      { emoji: '', name: '新增', description: '新建文件' }
    ];

    const expected = commitType.map((type: ICommitType) => type.name);
    const result = toLintType(commitType);

    expect(result).toEqual(expected);
  });
});
