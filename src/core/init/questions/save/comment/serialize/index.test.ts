import serialize from '.';

describe('@/core/init/questions/save/comment/serialize/index.ts', () => {
  it('空对象应返回空字符串', () => {
    const config = {};
    const expected = '{\n}';
    expect(serialize(config, {}, '  ')).toBe(expected);
  });

  it('带有属性的对象应正确序列化', () => {
    const config = {
      name: 'John',
      age: 30
    };
    const comments = {
      name: '姓名',
      age: '年龄'
    };
    const expected = `{
  // 姓名
  "name": "John",
  // 年龄
  "age": 30
}`;
    expect(serialize(config, comments, '  ')).toBe(expected);
  });

  it('嵌套对象应正确序列化', () => {
    const config = {
      name: 'John',
      age: 30,
      address: {
        city: 'New York',
        street: '5th Avenue'
      }
    };
    const comments = {
      name: '姓名',
      age: '年龄',
      address: '地址\n包含了城市和街道的信息',
      'address.city': '城市',
      'address.street': '街道'
    };
    const expected = `{
  // 姓名
  "name": "John",
  // 年龄
  "age": 30,
  /**
   * 地址
   * 包含了城市和街道的信息
   */
  "address": {
    // 城市
    "city": "New York",
    // 街道
    "street": "5th Avenue"
  }
}`;
    expect(serialize(config, comments, '  ')).toBe(expected);
  });

  it('数组应正确序列化', () => {
    const config = {
      colors: ['red', 'green', 'blue']
    };
    const comments = {
      colors: '颜色数组'
    };
    const expected = `{
  // 颜色数组
  "colors": ["red", "green", "blue"]
}`;
    expect(serialize(config, comments, '  ')).toBe(expected);
  });

  it('带有数组和嵌套对象的复杂对象应正确序列化', () => {
    const config = {
      user: {
        name: 'John',
        hobbies: ['reading', 'gaming']
      },
      version: 1
    };
    const comments = {
      user: '用户信息',
      'user.name': '用户名',
      'user.hobbies': '用户爱好',
      version: '版本号'
    };
    const expected = `{
  // 用户信息
  "user": {
    // 用户名
    "name": "John",
    // 用户爱好
    "hobbies": ["reading", "gaming"]
  },
  // 版本号
  "version": 1
}`;
    expect(serialize(config, comments, '  ')).toBe(expected);
  });

  it('空数组应正确序列化', () => {
    const config = {
      items: []
    };
    const comments = {
      items: '空数组'
    };
    const expected = `{
  // 空数组
  "items": []
}`;
    expect(serialize(config, comments, '  ')).toBe(expected);
  });

  // 处理布尔值和null
  it('应当正确序列化包含布尔值和null的对象', () => {
    const config = {
      isActive: true,
      isNull: null
    };
    const comments = {
      isActive: '是否激活',
      isNull: '空值'
    };
    const expected = `{
  // 是否激活
  "isActive": true,
  // 空值
  "isNull": null
}`;
    expect(serialize(config, comments, '  ')).toBe(expected);
  });

  it('没有注释的属性应该正确序列化', () => {
    const config = {
      name: 'John'
    };
    const comments = {};
    const expected = `{
  "name": "John"
}`;
    expect(serialize(config, comments, '  ')).toBe(expected);
  });

  it('应当正确序列化具有特殊字符键名的对象', () => {
    const config = {
      'complex-key': 'value'
    };
    const comments = {
      'complex-key': '复杂键名'
    };
    const expected = `{
  // 复杂键名
  "complex-key": "value"
}`;
    expect(serialize(config, comments, '  ')).toBe(expected);
  });

  it('应当正确序列化默认缩进', () => {
    const config = {
      'complex-key': 'value'
    };
    const comments = {
      'complex-key': '复杂键名'
    };
    const expected = `{
  // 复杂键名
  "complex-key": "value"
}`;
    expect(serialize(config, comments)).toBe(expected);
  });

  it('应当正确序列化4个缩进', () => {
    const config = {
      'complex-key': 'value'
    };
    const comments = {
      'complex-key': '复杂键名'
    };
    const expected = `{
    // 复杂键名
    "complex-key": "value"
}`;
    expect(serialize(config, comments, '    ')).toBe(expected);
  });

  it('应当正确序列化tab缩进', () => {
    const config = {
      'complex-key': 'value'
    };
    const comments = {
      'complex-key': '复杂键名'
    };
    const expected = `{
\t// 复杂键名
\t"complex-key": "value"
}`;
    expect(serialize(config, comments, '\t')).toBe(expected);
  });

  it('应当正确处理undefined值', () => {
    const config = {
      undefinedValue: undefined
    };
    const comments = {
      undefinedValue: '未定义值'
    };
    const expected = `{
  // 未定义值
  "undefinedValue": undefined
}`;
    expect(serialize(config, comments, '  ')).toBe(expected);
  });
});
