import parse from '.';

describe('@/utils/git/message/parse/index.ts', () => {
  it('解析包含 emoji、type 和 scope 的提交信息 1', () => {
    expect(parse('🐛 fix(lib): 修复了一个问题')).toEqual({
      full: '🐛 fix(lib): 修复了一个问题',
      emojiOrType: '🐛 fix',
      emoji: '🐛',
      type: 'fix',
      scope: 'lib',
      message: '修复了一个问题'
    });
  });

  it('解析包含 emoji、type 和 scope 的提交信息 2', () => {
    expect(parse('✨ feature(lib): Add version management')).toEqual({
      full: '✨ feature(lib): Add version management',
      emojiOrType: '✨ feature',
      emoji: '✨',
      type: 'feature',
      scope: 'lib',
      message: 'Add version management'
    });
  });

  it('解析包含 emoji、type 和 scope 的提交信息 3', () => {
    expect(parse('✨   xxxx sss  feature(lib): Add version management')).toEqual({
      full: '✨   xxxx sss  feature(lib): Add version management',
      emojiOrType: '✨   xxxx sss  feature',
      emoji: '✨',
      type: 'xxxx sss  feature',
      scope: 'lib',
      message: 'Add version management'
    });
  });

  it('解析包含 emoji、type 和 scope 的提交信息 4', () => {
    expect(parse('🐛feature(lib): Add version management')).toEqual({
      full: '🐛feature(lib): Add version management',
      emojiOrType: '🐛feature',
      emoji: '🐛',
      type: 'feature',
      scope: 'lib',
      message: 'Add version management'
    });
  });

  it('解析包含 emoji、type 和 scope 的提交信息 5', () => {
    expect(parse('🐛✨feature(lib): Add version management')).toEqual({
      full: '🐛✨feature(lib): Add version management',
      emojiOrType: '🐛✨feature',
      emoji: '🐛✨',
      type: 'feature',
      scope: 'lib',
      message: 'Add version management'
    });
  });

  it('解析包含 emoji、type 和 scope 的提交信息 6', () => {
    expect(parse('🐛✨ -*/123-*481234alkjsdf%!*@* feature(lib): Add version management')).toEqual({
      full: '🐛✨ -*/123-*481234alkjsdf%!*@* feature(lib): Add version management',
      emojiOrType: '🐛✨ -*/123-*481234alkjsdf%!*@* feature',
      emoji: '🐛✨',
      type: '-*/123-*481234alkjsdf%!*@* feature',
      scope: 'lib',
      message: 'Add version management'
    });
  });

  it('解析仅包含 type 和 scope 的提交信息', () => {
    expect(parse('fix(lib): 修复了一个问题')).toEqual({
      full: 'fix(lib): 修复了一个问题',
      emojiOrType: 'fix',
      emoji: '',
      type: 'fix',
      scope: 'lib',
      message: '修复了一个问题'
    });
  });

  it('解析仅包含 type 的提交信息', () => {
    expect(parse('fix: 修复了一个问题')).toEqual({
      full: 'fix: 修复了一个问题',
      emojiOrType: 'fix',
      emoji: '',
      type: 'fix',
      scope: '',
      message: '修复了一个问题'
    });
  });

  it('解析不符合格式的提交信息', () => {
    expect(parse('修复了一个问题！！！')).toEqual({
      full: '',
      emojiOrType: '',
      emoji: '',
      type: '',
      scope: '',
      message: '修复了一个问题！！！'
    });
  });

  it('解析空字符串', () => {
    expect(parse('')).toEqual({
      full: '',
      emojiOrType: '',
      emoji: '',
      type: '',
      scope: '',
      message: ''
    });
  });
});
