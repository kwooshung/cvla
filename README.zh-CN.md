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
      - [本仓库的 commit types 配置](https://github.com/kwooshung/cvlar/scripts/ks-cvlar.types.cjs)
      - [本仓库的 commit scopes 配置](<[https://](https://github.com/kwooshung/cvlar/scripts/ks-cvlar.scopes.cjs)>)
  - 参考：[本仓库的 cvlar config](https://github.com/kwooshung/cvlar/.ks-cvlarrc.cjs)；
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

初始化之后的配置，`.ks-cvlarrc.cjs` 可以存在任何位置，上图因为检测到了配置文件，所以没有出现指定保存路径的选项。

- [本仓库的 commit types 配置](https://github.com/kwooshung/cvlar/scripts/ks-cvlar.types.cjs)
- [本仓库的 commit scopes 配置](<[https://](https://github.com/kwooshung/cvlar/scripts/ks-cvlar.scopes.cjs)>)
- [本仓库的 cvlar config](https://github.com/kwooshung/cvlar/.ks-cvlarrc.cjs)；

## 主菜单 `cvlar`

![Cvlar 主菜单](/images/docs/cn/menu-main.png)

## 运行 `package.json script`

![Cvlar 主菜单 > 运行 > 脚本](/images/docs/cn/menu-run-scripts.gif)

## 运行 提交代码

![Cvlar 主菜单 > 运行 > 提交代码](/images/docs/cn/menu-git-commit-files.gif)

## 运行 升级版本号

![Cvlar 主菜单 > 运行 > 升级标签](/images/docs/cn/menu-git-commit-tag.gif)

## 运行 包管理

### 安装依赖
