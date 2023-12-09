import merge from '.';

describe('@/utils/config/merge/index.ts', () => {
  const defaultConfig: any = {
    package: {
      manager: {
        commands: {
          install: '默认安装',
          uninstall: '默认卸载'
        }
      }
    }
  };

  it('用户配置为 "default" 时应使用默认配置', () => {
    const userConfig: any = {
      package: {
        manager: {
          commands: 'default'
        }
      }
    };
    const expected = {
      package: defaultConfig.package
    };
    expect(merge(defaultConfig, userConfig)).toEqual(expected);
  });

  it('用户配置为 false 时应禁用相应配置', () => {
    const userConfig: any = {
      setting1: false,
      setting2: false,
      setting3: /\d*/g,
      setting4: 123
    };
    const expected = {
      package: defaultConfig.package,
      setting3: userConfig.setting3,
      setting4: userConfig.setting4
    };
    expect(merge(defaultConfig, userConfig)).toEqual(expected);
  });

  it('用户自定义命令顺序应被应用', () => {
    const userConfig: any = {
      package: {
        manager: {
          commands: {
            uninstall: '用户卸载',
            install: '用户安装'
          }
        }
      }
    };
    const expected = {
      package: {
        manager: {
          commands: {
            uninstall: '用户卸载',
            install: '用户安装'
          }
        }
      }
    };
    expect(merge(defaultConfig, userConfig)).toEqual(expected);
  });

  it('没有 package 项目', () => {
    const defaultConfig: any = {
      setting1: 'default1',
      setting2: 'default2',
      setting3: {
        subSetting1: 'subDefault1',
        subSetting2: 'subDefault2'
      }
    };

    const userConfig: any = {
      setting1: 'default',
      setting2: 'default'
    };

    const expected = {
      ...defaultConfig,
      setting1: defaultConfig.setting1,
      setting2: defaultConfig.setting2
    };
    expect(merge(defaultConfig, userConfig)).toEqual(expected);
  });

  it('用户配置中，没有 package', () => {
    const defaultConfig: any = {
      setting1: 'default1',
      setting2: 'default2',
      package: {}
    };

    const userConfig: any = {
      setting1: 'default',
      setting2: 'defaultUser'
    };

    const expected = {
      ...defaultConfig,
      setting1: defaultConfig.setting1,
      setting2: userConfig.setting2
    };
    expect(merge(defaultConfig, userConfig)).toEqual(expected);
  });

  it('用户配置的 package.manager 不存在', () => {
    const defaultConfig: any = {
      package: {
        manager: {
          commands: {
            install: '用户安装',
            uninstall: '用户卸载'
          }
        }
      }
    };

    const userConfig: any = {
      package: {}
    };

    const expected = {
      ...defaultConfig
    };
    expect(merge(defaultConfig, userConfig)).toEqual(expected);
  });

  it('默认配置的 package.manager 存在但 commands 不存在', () => {
    const defaultConfig: any = {
      package: {
        manager: {}
      }
    };
    const userConfig: any = {
      package: {
        manager: {
          commands: {
            install: '用户安装',
            uninstall: '用户卸载'
          }
        }
      }
    };
    const expected = {
      package: {
        manager: {
          commands: userConfig.package.manager.commands
        }
      }
    };
    expect(merge(defaultConfig, userConfig)).toEqual(expected);
  });

  it('默认配置中没有 package 属性', () => {
    const defaultConfig: any = {
      setting1: 'default1',
      setting2: 'default2'
    };
    const userConfig: any = {
      package: {
        manager: {
          commands: {
            install: '用户安装',
            uninstall: '用户卸载'
          }
        }
      }
    };
    const expected = {
      ...defaultConfig,
      package: userConfig.package
    };
    expect(merge(defaultConfig, userConfig)).toEqual(expected);
  });

  it('默认配置的 package 中没有 manager 属性', () => {
    const defaultConfig: any = {
      package: {}
    };
    const userConfig: any = {
      package: {
        manager: {
          commands: {
            install: '用户安装',
            uninstall: '用户卸载'
          }
        }
      }
    };
    const expected = {
      package: userConfig.package
    };
    expect(merge(defaultConfig, userConfig)).toEqual(expected);
  });

  it('commands 不存在', () => {
    const userConfig: any = {
      setting1: 'default',
      setting2: 'defaultUser'
    };

    const expected = {
      ...defaultConfig,
      setting1: userConfig.setting1,
      setting2: userConfig.setting2
    };
    expect(merge(defaultConfig, userConfig)).toEqual(expected);
  });

  it('什么配置都没有', () => {
    expect(merge(undefined, undefined)).toEqual({});
  });

  it('没有 userConfig 项目', () => {
    const userConfig: any = undefined;

    const expected = {
      ...defaultConfig
    };
    expect(merge(defaultConfig, userConfig)).toEqual(expected);
  });

  it('什么配置都没有', () => {
    expect(merge(undefined, undefined)).toEqual({});
  });
});
