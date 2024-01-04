<div align="center">

<img alt="@kwooshung/cvlar" src="./images/logos/128x128.png"/>

# @kwooshung/cvlar

![GitHub Release Date - Published_At](https://img.shields.io/github/release-date/kwooshung/cvlar?labelColor=272e3b&color=00b42A&logo=github)
![GitHub last commit](https://img.shields.io/github/last-commit/kwooshung/cvlar?labelColor=272e3b&color=165dff)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/kwooshung/cvlar?labelColor=272e3b&color=165dff)
![GitHub top language](https://img.shields.io/github/languages/top/kwooshung/cvlar?labelColor=272e3b&color=165dff)
![GitHub pull requests](https://img.shields.io/github/issues-pr/kwooshung/cvlar?labelColor=272e3b&color=165dff)
![GitHub issues](https://img.shields.io/github/issues/kwooshung/cvlar?labelColor=272e3b&color=165dff)
[![NPM Version](https://img.shields.io/npm/v/@kwooshung/cvlar?labelColor=272e3b&color=165dff)](https://www.npmjs.com/package/@kwooshung/cvlar)
[![Npm.js Downloads/Week](https://img.shields.io/npm/dw/@kwooshung/cvlar?labelColor=272e3b&labelColor=272e3b&color=165dff&logo=npm)](https://www.npmjs.com/package/@kwooshung/cvlar)
[![Github CI/CD](https://github.com/kwooshung/cvlar/actions/workflows/ci.yml/badge.svg)](https://github.com/kwooshung/cvlar/actions/)
[![codecov](https://codecov.io/gh/kwooshung/cvlar/graph/badge.svg?token=VVZJE7H0KD)](https://codecov.io/gh/kwooshung/cvlar)
[![Maintainability](https://api.codeclimate.com/v1/badges/325d0881b1ca19165d35/maintainability)](https://codeclimate.com/github/kwooshung/cvlar/maintainability/)
[![GitHub License](https://img.shields.io/github/license/kwooshung/cvlar?labelColor=272e3b&color=165dff)](LICENSE)
[![Gitee Repo](https://img.shields.io/badge/gitee-cvlar-165dff?logo=gitee)](https://gitee.com/kwooshung/cvlar/)
![Github Stars](https://img.shields.io/github/stars/kwooshung/cvlar?labelColor=272e3b&color=165dff)

<p align="center">
    <a href="README.md">English</a> | 
    <a href="README.zh-CN.md" style="font-weight:700;color:#165dff;text-decoration:underline;">中文</a>
</p>
</div>

# 为什么开发它？

在这之前，做一个开源项目，我需要使用以下包，才能实现，git提交标准化，版本号管理，changelog自动生成等功能，还得使用我自己开发的项目 [standard-version-helper](https://github.com/kwooshung/standard-version-helper) 才能实现控制台交互式升级版本的功能；当然自然也没有在 Github Actions 中自动发布版本的功能。当您如用了 Cvlar 之后，您只需要选择性保留 `commitlint` 即可实现前面说的所有功能，而且还有更多的功能。

- ~~commitizen~~
- **commitlint**
- ~~commitlint-config-cz~~
- ~~commitlint-config-git-commit-emoji~~
- ~~conventional-changelog~~
- ~~conventional-changelog-cli~~
- ~~cz-conventional-changelog~~
- ~~cz-customizable~~
- ~~standard-version~~
- ~~@kwooshung/standard-version-helper~~

# 为什么叫 Cvlar？

- C：`commit`
- V：`version`
- L：`changelog`
- R：`release`

> 当然，虽然名字叫 Cvlar，功能并不局限于此。

# 怎么读？

cvlar，是一个工具合集的首字母组成的词，没有具体的意义，但是怎么读呢？根据单词的发音，可以推出音标`[siːvəlɑr]`，而读起来感觉和中文的 `思维乐` 很相似，所以就起了这么一个名字；

> 因为编程这个职业，需要大量的思考，作者更希望大家在乐趣中编程。（好吧，我承认，其实是因为先有的名字，这个是强行解释的😂）

# 特点简述

- **简单记住**：命令 `cvlar` 即可，也可使用 `cvlar -h/help` 查看帮助；
- **轻松选择并运行**：`package.json` 中的 `scripts` 脚本；
- **包管理**：
  - 轻松选择 `npm`、`yarn`、`pnpm`，或其他包管理工具，自动安装；
  - 可设置源，不会影响原有配置；
- **git提交**：
  - 轻松选择 '提交 types' 和 `提交 scopes`；
  - 写入 '短说明'、'长说明'、'关闭 issues'、自定义 '字段'、验证 '提交信息' 等，同时还能自动 '推送到仓库'；
  - 若您希望希望 `commit message` 使用英文，而自己又不擅长英文，也支持通过 google 自动翻译成您指定的语言；
- **版本管理**：
  - 轻松 '升级版本号' 选择 '主要版本'、'次要版本'、'补丁版本' 和 '预览版本'，而 '预览版本' 可自动迭代 '预览版本号'，比如 `v1.0.0-preview.1`、`v1.0.0-preview.2` 等；
  - 你也可以指定 '升级版本号'；也可以 '降级版本'；
  - 可自动生成 'changelog'，并自动 '推送到仓库'；
- **日志管理**：轻松设置 '模板'，自动根据 `git message` 生成 `changelog`，更是可以通过 Google 翻译，自动翻译成 **多种语言** 日志，自动 '推送到仓库'；
- **自动发布**：
  - 在 `Github Actions` 中，调用 `cvlar -r` 命令，将会自动分析 `日志` 文件，将其自动发布到仓库版本页面中。
  - 参考：[本仓库的 releases 页](https://github.com/kwooshung/cvlar/releases)；
- **配置简单**：
  - 也可以通过 `cvlar -i/init`，交互式生成配置文件；
  - 初始化交互式菜单，支持中文和英文，后续的使用，支持任意语言，只需要在 `cvlar` 的配置文件中自定义即可；
  - 配置文件本可支持 `js`、`cjs` 和 `mjs`；
    - 为了方便只配置一次 `commit types` 和 `commit scopes`；
    - 发现 `commitlint` 无法识别 `mjs`，所以暂时只支持 `cjs` 和 `js` 格式的配置；
  - 参考：
    - [本仓库的 commit types 配置](https://github.com/kwooshung/cvlar/blob/main/scripts/ks-cvlar.types.cjs)
    - [本仓库的 commit scopes 配置](https://github.com/kwooshung/cvlar/blob/main/scripts/ks-cvlar.scopes.cjs)
    - [本仓库的 cvlar config](https://github.com/kwooshung/cvlar/blob/main/.ks-cvlarrc.cjs)；
- 菜单可通过配置自定义语言
- 提升工作效率
- 对新手友好

# 安装

## npm

```bash
npm install standard-version @kwooshung/cvlar --save-dev
```

## yarn

```bash
yarn add standard-version @kwooshung/cvlar -D
```

## pnpm

```bash
pnpm add standard-version @kwooshung/cvlar -D
```

# 使用方法

## 查看帮助 `cvlar -[h, help]`

![Cvlar 帮助](/images/docs/help.png)

## 初始化 `cvlar -[i, init]`

![cvlar -i/init](/images/docs/cn/init.gif)

1. 初始化配置，生成的配置文件，仅包含 **中文** 和 **英文** 两种语言的配置，且在配置中加入了大量对应的注释，方便理解；
2. `cvlar` 支持任意语言，只需要在 `cvlar` 的配置文件中自定义即可；
3. 初始化之后的配置，`.ks-cvlarrc.cjs` 可以存在任何位置，上图因为检测到了配置文件，所以没有出现指定保存路径的选项；

- [本仓库的 commit types 配置](https://github.com/kwooshung/cvlar/blob/main/scripts/ks-cvlar.types.cjs)
- [本仓库的 commit scopes 配置](https://github.com/kwooshung/cvlar/blob/main/scripts/ks-cvlar.scopes.cjs)
- [本仓库的 cvlar config](https://github.com/kwooshung/cvlar/blob/main/.ks-cvlarrc.cjs)；

## 主菜单 `cvlar`

![Cvlar 主菜单](/images/docs/cn/menu-main.png)

## 运行 `package.json script`

![Cvlar 主菜单 > 运行 > 脚本](/images/docs/cn/menu-run-scripts.gif)

## git 提交

### 提交代码

![Cvlar 主菜单 > 运行 > 提交代码](/images/docs/cn/menu-git-commit-files.gif)

### 升级版本号

![Cvlar 主菜单 > 运行 > 升级标签](/images/docs/cn/menu-git-commit-tag.gif)

## 运行 包管理

### 安装依赖

![Cvlar 主菜单 > 包管理 > 安装依赖](/images/docs/cn/menu-package-install.gif)

### 卸载依赖

![Cvlar 主菜单 > 包管理 > 卸载依赖](/images/docs/cn/menu-package-uninstall.gif)

### 更新依赖

![Cvlar 主菜单 > 包管理 > 更新依赖](/images/docs/cn/menu-package-update.gif)

### 列出过时的包

![Cvlar 主菜单 > 包管理 > 列出过时的包](/images/docs/cn/menu-package-outdated.gif)

### 查看依赖列表

![Cvlar 主菜单 > 包管理 > 列出过时的包](/images/docs/cn/menu-package-list.gif)

### 查看包详细信息

![Cvlar 主菜单 > 包管理 > 查看包详细信息](/images/docs/cn/menu-package-info.gif)

### 搜索包

![Cvlar 主菜单 > 包管理 > 搜索包](/images/docs/cn/menu-package-search.gif)

## 日志管理

这里使用 **重新生成日志** 作为演示，因为它是由 **清理日志** 和 **生成日志** 两个步骤组成的。

![Cvlar 主菜单 > 日志管理 > 重新生成日志](/images/docs/cn/menu-changelog-rebuild.gif)

## 自动发布

### 参考

- [本仓库的 releases 页](https://github.com/kwooshung/cvlar/releases)；
- [本仓库的 Github Actions](https://github.com/kwooshung/cvlar/blob/main/.github/workflows/ci.yml)；

### 脚本参考

```yml
- name: Auto Release
  run: npx cvlar -r
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

# 配置

## 默认搜索路径及文件

其中注释的 `.mjs` 文件，就像前面说的那样，`commitlint` 无法识别 `mjs`，所以暂时只支持 `cjs` 和 `js` 格式的配置；

```javascript
[
  '/ks-cvlar.js',
  '/ks-cvlar.conf.js',
  '/ks-cvlar.config.js',
  //'/ks-cvlar.mjs',
  //'/ks-cvlar.conf.mjs',
  //'/ks-cvlar.config.mjs',
  '/ks-cvlar.cjs',
  '/ks-cvlar.conf.cjs',
  '/ks-cvlar.config.cjs',
  '/ks-cvlarrc.js',
  '/ks-cvlarrc.conf.js',
  '/ks-cvlarrc.config.js',
  //'/ks-cvlarrc.mjs',
  //'/ks-cvlarrc.conf.mjs',
  //'/ks-cvlarrc.config.mjs',
  '/ks-cvlarrc.cjs',
  '/ks-cvlarrc.conf.cjs',
  '/ks-cvlarrc.config.cjs',
  'ks-cvlar.js',
  'ks-cvlar.conf.js',
  'ks-cvlar.config.js',
  //'ks-cvlar.mjs',
  //'ks-cvlar.conf.mjs',
  //'ks-cvlar.config.mjs',
  'ks-cvlar.cjs',
  'ks-cvlar.conf.cjs',
  'ks-cvlar.config.cjs',
  'ks-cvlarrc.js',
  'ks-cvlarrc.conf.js',
  'ks-cvlarrc.config.js',
  //'ks-cvlarrc.mjs',
  //'ks-cvlarrc.conf.mjs',
  //'ks-cvlarrc.config.mjs',
  'ks-cvlarrc.cjs',
  'ks-cvlarrc.conf.cjs',
  'ks-cvlarrc.config.cjs',
  '.ks-cvlar.js',
  '.ks-cvlar.conf.js',
  '.ks-cvlar.config.js',
  //'.ks-cvlar.mjs',
  //'.ks-cvlar.conf.mjs',
  //'.ks-cvlar.config.mjs',
  '.ks-cvlar.cjs',
  '.ks-cvlar.conf.cjs',
  '.ks-cvlar.config.cjs',
  '.ks-cvlarrc.js',
  '.ks-cvlarrc.conf.js',
  '.ks-cvlarrc.config.js',
  //'.ks-cvlarrc.mjs',
  //'.ks-cvlarrc.conf.mjs',
  //'.ks-cvlarrc.config.mjs',
  '.ks-cvlarrc.cjs',
  '.ks-cvlarrc.conf.cjs',
  '.ks-cvlarrc.config.cjs',
  'config/ks-cvlar.js',
  'config/ks-cvlar.conf.js',
  'config/ks-cvlar.config.js',
  //'config/ks-cvlar.mjs',
  //'config/ks-cvlar.conf.mjs',
  //'config/ks-cvlar.config.mjs',
  'config/ks-cvlar.cjs',
  'config/ks-cvlar.conf.cjs',
  'config/ks-cvlar.config.cjs',
  'config/ks-cvlarrc.js',
  'config/ks-cvlarrc.conf.js',
  'config/ks-cvlarrc.config.js',
  //'config/ks-cvlarrc.mjs',
  //'config/ks-cvlarrc.conf.mjs',
  //'config/ks-cvlarrc.config.mjs',
  'config/ks-cvlarrc.cjs',
  'config/ks-cvlarrc.conf.cjs',
  'config/ks-cvlarrc.config.cjs',
  '.config/ks-cvlar.js',
  '.config/ks-cvlar.conf.js',
  '.config/ks-cvlar.config.js',
  //'.config/ks-cvlar.mjs',
  //'.config/ks-cvlar.conf.mjs',
  //'.config/ks-cvlar.config.mjs',
  '.config/ks-cvlar.cjs',
  '.config/ks-cvlar.conf.cjs',
  '.config/ks-cvlar.config.cjs',
  '.config/ks-cvlarrc.js',
  '.config/ks-cvlarrc.conf.js',
  '.config/ks-cvlarrc.config.js',
  //'.config/ks-cvlarrc.mjs',
  //'.config/ks-cvlarrc.conf.mjs',
  //'.config/ks-cvlarrc.config.mjs',
  '.config/ks-cvlarrc.cjs',
  '.config/ks-cvlarrc.conf.cjs',
  '.config/ks-cvlarrc.config.cjs'
];
```

## 指定配置文件

若您想将配置文件存放在其他位置，可以通过以下命令指定配置文件的所在目录，这样 `cvlar` 将会优先寻找 `-[cd/config-dir]` 指定的目录；

> 注意，是文件夹路径，不是文件路径！

```
cvlar -[cd/config-dir] xxx/xx/x
```

推荐在 `package.json` 中的 `scripts` 中配置；

```json
{
  "scripts": {
    "cvlar": "cvlar -cd xxx/xx/x"
  }
}
```

## 配置文件说明及参考

通过 `cvlar -i/init`，生成对应配置文件，参考上方的 **初始化** 部分；
以下两个文件，均使用此命令生成的配置文件，分别是 **中文** 和 **英文** 两种语言的配置；

- [.ks-cvlarrc.cjs](https://github.com/kwooshung/cvlar/blob/main/.ks-cvlarrc.cjs)
- [.ks-cvlarrc.en.cjs](https://github.com/kwooshung/cvlar/blob/main/.ks-cvlarrc.en.cjs)

# 其他

## commitlint 配置

此文件 [.commitlintrc.cjs](https://github.com/kwooshung/cvlar/blob/main/.commitlintrc.cjs) 是 `commitlint` 的配置文件，用于 `commitlint` 的配置；
为了方便统一管理，所以独立出来了 `ks-cvlar.types.cjs` 和 `ks-cvlar.scopes.cjs` 两个文件，用于 `commitlint` 的 `types` 和 `scopes` 的配置，及 `cvlar` 的 `commit` 菜单的配置；

- [本仓库的 commit types 配置](https://github.com/kwooshung/cvlar/blob/main/scripts/ks-cvlar.types.cjs)
- [本仓库的 commit scopes 配置](https://github.com/kwooshung/cvlar/blob/main/scripts/ks-cvlar.scopes.cjs)

在 [.commitlintrc.cjs](https://github.com/kwooshung/cvlar/blob/main/.commitlintrc.cjs) 中，可以引入 `ks-cvlar.types.cjs` 和 `ks-cvlar.scopes.cjs` 两个文件，但由于 `cvlar` 的 `commit` 配置 和 `commitlint` 不同，所以您需要这样引入两个函数：

```javascript
const { ConvertToLintTypes, ConvertToLintScopes } = require('@kwooshung/cvlar');
```

方便转换成 `commitlint` 的配置，具体使用方法，请参考 [.commitlintrc.cjs](https://github.com/kwooshung/cvlar/blob/main/.commitlintrc.cjs)；

### commit message 启用翻译

若是开启了 `commit message` 的翻译功能，短说明一般是72个字符，则不建议 `commitlint` 的 `header-max-length` 规则不建议也是72个字符，因为 `commit message` 的翻译后，可能会超过72个字符，导致 `commitlint` 报错；
推荐将 `commitlint` 的 `header-max-length` 规则设置方案有3个：

#### 方案一（推荐）：将 `commitlint` 的 `header-max-length` 规则，设置为正常字数的 `72` 的 `2倍` 及 `以上`，比如 `200`

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 200]
  }
};
```

#### 方案二：关闭 `commitlint` 的 `header-max-length` 规则，但不确定未来是否会有其他问题

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 'header-max-length': [0, 'always', 72]
  }
};
```

#### 方案三：将 `commitlint` 的 `header-max-length` 规则，设置为如下

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [0, 'always']
  }
};
```

## .gitigonre 忽略git提交临时文件

建议在 `.gitigonre` 中添加以下内容，以免将 `cvlar` 的临时文件提交到仓库中；
避免某些边缘情况下，误提交临时文件到仓库中，导致仓库中出现不必要的文件；
这种文件会在合适的时候，自动删除，所以不用担心；
这样做，是双保险！

```
.cvlar-commit-message-*.tmp
```

# 开发 & 维护

- 本项目主要是为了加速开发所生，每日开发时间较短，且时间比较紧簇，难免存在一些未知的问题，欢迎大家提出宝贵的意见和建议，请友好友善提交！
- 最近本人工作较赶，对于 `issue` 和 `pr` 的处理可能会有些慢，还请大家见谅，但还是希望大家能够踊跃提交 `issue` 和 `pr`，一旦有时间，将会集中处理！
- 因为本人时间问题，更推荐大家进行 `pr`，这样可以更快的解决问题！
