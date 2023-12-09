import Commit from '.';

describe('@/utils/git/commit/index.ts', () => {
  it('应该生成一个带有所有字段的有效Git提交命令', () => {
    const data = {
      type: 'feat',
      scope: 'login',
      subject: '添加登录功能',
      body: '实现了基本的登录逻辑\n添加了表单验证',
      breaking: '登录功能无法正常使用',
      issues: [
        { close: 'Closes', id: '#123#456--#789,#654.#789#1001#2002' },
        { close: 'Fixes', id: '#321#654#987' }
      ],
      custom: [{ field: 'Reviewed-by', value: 'Alice' }, { value: '这是一个没有字段名称的自定义信息' }]
    };

    const generator = new Commit(data);
    const command = generator.generate();

    expect(command).toBe(
      'git commit -m "feat(login): 添加登录功能\n\n实现了基本的登录逻辑\n添加了表单验证\n\nBREAKING CHANGE: 登录功能无法正常使用\n\nCloses: #123, #456, #789, #654, #789, #1001, #2002\nFixes: #321, #654, #987\n\nReviewed-by: Alice\n这是一个没有字段名称的自定义信息"'
    );
  });

  it('应该生成一个带有最小字段的有效Git提交命令', () => {
    const data = {
      type: 'fix',
      subject: '修复了一个Bug'
    };

    const generator = new Commit(data);
    const command = generator.generate();

    expect(command).toBe('git commit -m "fix: 修复了一个Bug"');
  });

  it('应该生成一个不包含BREAKING CHANGE的有效Git提交命令', () => {
    const data = {
      type: 'feat',
      subject: '添加新功能',
      breaking: ''
    };

    const generator = new Commit(data);
    const command = generator.generate();

    expect(command).toBe('git commit -m "feat: 添加新功能"');
  });

  it('应该生成一个不包含自定义字段的有效Git提交命令', () => {
    const data = {
      type: 'chore',
      subject: '更新配置'
    };

    const generator = new Commit(data);
    const command = generator.generate();

    expect(command).toBe('git commit -m "chore: 更新配置"');
  });

  it('应该生成一个带有多个Issue和自定义字段的有效Git提交命令', () => {
    const data = {
      type: 'feat',
      subject: '添加新功能',
      issues: [
        { close: 'Closes', id: '#123' },
        { close: 'Fixes', id: '#456' }
      ],
      custom: [{ field: 'Reviewed-by', value: 'Bob' }, { value: '这是一个自定义信息' }]
    };

    const generator = new Commit(data);
    const command = generator.generate();

    expect(command).toBe('git commit -m "feat: 添加新功能\n\nCloses: #123\nFixes: #456\n\nReviewed-by: Bob\n这是一个自定义信息"');
  });

  it('应该生成一个只包含主题和自定义字段的有效Git提交命令', () => {
    const data = {
      type: 'chore',
      subject: '更新配置',
      custom: [
        { field: 'Reviewed-by', value: 'Charlie' },
        { field: 'Reviewed-at', value: '2023-11-30' }
      ]
    };

    const generator = new Commit(data);
    const command = generator.generate();

    expect(command).toBe('git commit -m "chore: 更新配置\n\nReviewed-by: Charlie\nReviewed-at: 2023-11-30"');
  });

  it('应该生成一个只包含BREAKING CHANGE的有效Git提交命令', () => {
    const data = {
      type: 'feat',
      subject: '添加新功能',
      breaking: '破坏性更新'
    };

    const generator = new Commit(data);
    const command = generator.generate();

    expect(command).toBe('git commit -m "feat: 添加新功能\n\nBREAKING CHANGE: 破坏性更新"');
  });

  it('应该生成一个只包含正文的有效Git提交命令', () => {
    const data = {
      type: 'feat',
      subject: '添加新功能',
      body: '这是一个长长的正文\n它包含多行文字'
    };

    const generator = new Commit(data);
    const command = generator.generate();

    expect(command).toBe('git commit -m "feat: 添加新功能\n\n这是一个长长的正文\n它包含多行文字"');
  });

  it('应该生成一个包含提交类型和主题的有效Git提交命令', () => {
    const data = {
      type: 'feat',
      subject: '添加新功能'
    };

    const generator = new Commit(data);
    const command = generator.generate();

    expect(command).toBe('git commit -m "feat: 添加新功能"');
  });

  it('应该生成一个包含多行正文的有效Git提交命令', () => {
    const data = {
      type: 'docs',
      subject: '更新文档',
      body: '这是一个长长的正文\n它包含多行文字'
    };

    const generator = new Commit(data);
    const command = generator.generate();

    expect(command).toBe('git commit -m "docs: 更新文档\n\n这是一个长长的正文\n它包含多行文字"');
  });

  it('应该生成一个包含BREAKING CHANGE的有效Git提交命令', () => {
    const data = {
      type: 'feat',
      subject: '添加新功能',
      breaking: '破坏性更新'
    };

    const generator = new Commit(data);
    const command = generator.generate();

    expect(command).toBe('git commit -m "feat: 添加新功能\n\nBREAKING CHANGE: 破坏性更新"');
  });

  it('应该生成一个包含关闭Issue的有效Git提交命令', () => {
    const data = {
      type: 'fix',
      subject: '修复问题',
      issues: [
        {
          close: 'Closes',
          id: '#123'
        },
        {
          close: 'Fixes',
          id: '#456'
        }
      ]
    };

    const generator = new Commit(data);
    const command = generator.generate();

    expect(command).toBe('git commit -m "fix: 修复问题\n\nCloses: #123\nFixes: #456"');
  });

  it('应该生成一个包含自定义字段的有效Git提交命令', () => {
    const data = {
      type: 'feat',
      subject: '添加新功能',
      custom: [
        {
          field: '版本',
          value: '1.0.0'
        },
        {
          field: '作者',
          value: 'Alice'
        }
      ]
    };

    const generator = new Commit(data);
    const command = generator.generate();

    expect(command).toBe('git commit -m "feat: 添加新功能\n\n版本: 1.0.0\n作者: Alice"');
  });

  it('应该生成一个包含所有字段的有效Git提交命令', () => {
    const data = {
      type: 'feat',
      scope: '登录',
      subject: '添加新功能',
      body: '这是一个长长的正文\n它包含多行文字',
      breaking: '破坏性更新',
      issues: [
        {
          close: 'Closes',
          id: '#123'
        },
        {
          close: 'Fixes',
          id: '#456'
        }
      ],
      custom: [
        {
          field: '版本',
          value: '1.0.0'
        },
        {
          field: '作者',
          value: 'Alice'
        }
      ]
    };

    const generator = new Commit(data);
    const command = generator.generate();

    expect(command).toBe('git commit -m "feat(登录): 添加新功能\n\n这是一个长长的正文\n它包含多行文字\n\nBREAKING CHANGE: 破坏性更新\n\nCloses: #123\nFixes: #456\n\n版本: 1.0.0\n作者: Alice"');
  });

  it('应该生成一个包含提交类型和作用域的有效Git提交命令', () => {
    const data = {
      type: '🐛 fix',
      scope: '登录',
      subject: '修复登录bug'
    };

    const generator = new Commit(data);
    const command = generator.generate();

    expect(command).toBe('git commit -m "🐛 fix(登录): 修复登录bug"');
  });

  it('应该生成一个只包含提交主题的有效Git提交命令', () => {
    const data = {
      type: 'new',
      subject: '添加新功能'
    };

    const generator = new Commit(data);
    const command = generator.generate();

    expect(command).toBe('git commit -m "new: 添加新功能"');
  });

  it('应该生成一个只包含正文的有效Git提交命令', () => {
    const data = {
      type: 'new',
      subject: '一些说明',
      body: '这是一个长长的正文\n它包含多行文字'
    };

    const generator = new Commit(data);
    const command = generator.generate();

    expect(command).toBe('git commit -m "new: 一些说明\n\n这是一个长长的正文\n它包含多行文字"');
  });

  it('应该生成一个只包含BREAKING CHANGE的有效Git提交命令', () => {
    const data = {
      type: 'new',
      subject: '一些说明',
      breaking: '破坏性更新'
    };

    const generator = new Commit(data);
    const command = generator.generate();

    expect(command).toBe('git commit -m "new: 一些说明\n\nBREAKING CHANGE: 破坏性更新"');
  });

  it('应该生成一个只包含自定义字段的有效Git提交命令', () => {
    const data = {
      type: 'new',
      subject: '一些说明',
      custom: [
        {
          field: '版本',
          value: '1.0.0'
        },
        {
          field: '作者',
          value: 'Alice'
        }
      ]
    };

    const generator = new Commit(data);
    const command = generator.generate();

    expect(command).toBe('git commit -m "new: 一些说明\n\n版本: 1.0.0\n作者: Alice"');
  });

  it('应该生成一个只包含提交类型的有效Git提交命令', () => {
    const data = {
      type: '🚀Tools',
      scope: '工具',
      subject: '一些说明'
    };

    const generator = new Commit(data);
    const command = generator.generate();

    expect(command).toBe('git commit -m "🚀Tools(工具): 一些说明"');
  });
});
