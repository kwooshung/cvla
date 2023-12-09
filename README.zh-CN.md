<div align="center">

<img style="width:120px; height:120px;" alt="@kwooshung/cvlar" src="./logo/logo.png"/>

# Standard Version Helper

是一个基于 [standard-version](https://github.com/conventional-changelog/standard-version/) 的帮助工具，可以在控制台中提供简单的菜单选择。

[![GitHub License](https://img.shields.io/github/license/kwooshung/standard-version-helper?labelColor=272e3b&color=165dff)](LICENSE)
![GitHub Release Date - Published_At](https://img.shields.io/github/release-date/kwooshung/standard-version-helper?labelColor=272e3b&color=00b42A&logo=github)
![GitHub last commit](https://img.shields.io/github/last-commit/kwooshung/standard-version-helper?labelColor=272e3b&color=165dff)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/kwooshung/standard-version-helper?labelColor=272e3b&color=165dff)
![GitHub top language](https://img.shields.io/github/languages/top/kwooshung/standard-version-helper?labelColor=272e3b&color=165dff)
![GitHub pull requests](https://img.shields.io/github/issues-pr/kwooshung/standard-version-helper?labelColor=272e3b&color=165dff)
![GitHub issues](https://img.shields.io/github/issues/kwooshung/standard-version-helper?labelColor=272e3b&color=165dff)
![Github Stars](https://img.shields.io/github/stars/kwooshung/standard-version-helper?labelColor=272e3b&color=165dff)
[![NPM Version](https://img.shields.io/npm/v/@kwooshung/standard-version-helper?labelColor=272e3b&color=165dff)](https://www.npmjs.com/package/@kwooshung/standard-version-helper)
[![Npm.js Downloads/Week](https://img.shields.io/npm/dw/@kwooshung/standard-version-helper?labelColor=272e3b&labelColor=272e3b&color=165dff&logo=npm)](https://www.npmjs.com/package/@kwooshung/standard-version-helper)
[![Github CI/CD](https://github.com/kwooshung/standard-version-helper/actions/workflows/ci.yml/badge.svg)](https://github.com/kwooshung/standard-version-helper/actions/)
[![codecov](https://codecov.io/gh/kwooshung/standard-version-helper/graph/badge.svg?token=VVZJE7H0KD)](https://codecov.io/gh/kwooshung/standard-version-helper)
[![Maintainability](https://api.codeclimate.com/v1/badges/325d0881b1ca19165d35/maintainability)](https://codeclimate.com/github/kwooshung/standard-version-helper/maintainability/)
[![Gitee Repo](https://img.shields.io/badge/Gitee-standard--version--helper-165dff?logo=gitee)](https://gitee.com/kwooshung/standard-version-helper/)

<p align="center">
    <a href="README.md">English</a> | 
    <a href="README.zh-CN.md" style="font-weight:700;color:#165dff;text-decoration:underline;">中文</a>
</p>
</div>

## 为什么开发它？

- 我厌倦了命令行式的版本升级，每次都要记住命令，记住参数，记住各种规则，这些都是我不想记住的，我只想专注于业务开发，所以我开发了这个工具。
- 既然存在 `standard-version`，为何不能再有一个帮助工具呢？

## 特点

- **无需记忆** 命令
- **无需记忆** 参数
- **无需记忆** 语义化版本号
- **无需记忆** 版本号规则
- **无需记忆** 版本号撤销规则
- **无需记忆** 版本号强制规则
- **无需记忆** 版本号次要规则
- **无需记忆** 版本号补丁规则
- 版本号不怕写错，有验证提示
- 提升工作效率
- 对新手友好

## 菜单演示

假设您当前的项目版本是：`v2.0.0`；

- 以下菜单演示的是所有流程，即每个分支流程所应该显示的内容；
- 实际使用时，并不会像下方那样都展开，而是选择什么就显示什么，就像你使用其他的命令行菜单一样。

```
- 主菜单
  ├── 升级版本
  │ ├── 您打算升级哪个版本？
  │ ├── 主要版本：v2.0.0 > 3.0.0
  │ │ └── 是否推送到仓库？
  │ │ │ ├── Y（默认）：npx standard-version --release-as major && --follow-tags origin master
  │ │ │ └── N：npx standard-version --release-as major
  │ ├── 次要版本：v2.0.0 > 2.1.0
  │ │ └── 是否推送到仓库？
  │ │ │ ├── Y（默认）：npx standard-version --release-as minor && git push --follow-tags origin master
  │ │ │ └── N：npx standard-version --release-as minor
  │ ├── 补丁版本：v2.0.0 > 2.0.1
  │ │ └── 是否推送到仓库？
  │ │ │ ├── Y（默认）：npx standard-version --release-as patch && git push --follow-tags origin master
  │ │ │ └── N：npx standard-version --release-as patch
  │ └── 返回
  ├── 指定版本
  │ ├── 请输入版本号: 4.0.0
  │ │ └── 你当前的版本号为：v2.0.0，确认打入指定版本号：v4.0.0 Yes
  │ │ └── 是否推送到仓库？
  │ │ │ ├── Y（默认）：npx standard-version --release-as 4.0.0 && git push --follow-tags origin master
  │ │ │ └── N：npx standard-version --release-as 4.0.0
  ├── 撤销版本
  │ ├── 您打算撤销哪个版本？
  │ ├── 当前版本
  │ │ ├── 保留对文件的更改，仅撤销版本号？
  │ │ │ ├── 是
  │ │ │ │ └── 是否将 package.json 文件中的版本号：v2.0.0 更新为撤销后的版本号 v1.9.9？
  │ │ │ │ ├── 是
  │ │ │ │ │ └── 当前版本更新为：1.9.9
  │ │ │ │ └── 否
  │ │ │ └── 否
  │ ├── 撤销指定版本
  │ │ ├── 输入要撤销的版本号: 1.5.0
  │ │ │ ├── 保留对文件的更改，仅撤销版本号？
  │ │ │ │ ├── 是
  │ │ │ │ │ └── 是否将 package.json 文件中的版本号：v2.0.0 更新为撤销后的版本号 v1.4.9？
  │ │ │ │ │ ├── 是
  │ │ │ │ │ │ └── 当前版本更新为：1.4.9
  │ │ │ │ │ └── 否
  │ │ │ │ └── 否
  │ └── 返回
  └── 退出
```

## 安装

### npm

```bash
npm install standard-version @kwooshung/standard-version-helper --save-dev
```

### yarn

```bash
yarn add standard-version @kwooshung/standard-version-helper -D
```

### pnpm

```bash
pnpm add standard-version @kwooshung/standard-version-helper -D
```

## 推荐适用方法

### 在 `package.json` 中添加 `scripts` 脚本，如下：

```json
{
  "scripts": {
    "release": "standard-version-helper"
  }
}
```

### 支持两个参数：`--locale` 和 `--cmd`：

#### `--locale`

- 默认为简体中文
- 更改语言，如英文 `en_US` 则 `--locale en_US`，如下方代码所示
- 其他语言，均使用 Google 翻译，不能保证其准确性，如有翻译不准确的地方，欢迎提 `issue` & `PR`
- 语言列表见下方表格

```json
{
  "scripts": {
    "release": "standard-version-helper --locale en_US"
  }
}
```

#### `--cmd`

> 可以加一些自定义的命令，如 `ls -l`，这个命令

```json
{
  "scripts": {
    "release": "standard-version-helper --cmd ls -l"
  }
}
```

#### 综合用法

```json
{
  "scripts": {
    "release": "standard-version-helper --locale en_US --cmd ls -l"
  }
}
```

#### 版本号支持规则如下

验证通过的版本号正则格式：`/^(\d+)\.(\d+)\.(\d+)(?:-([\w-]+(?:\.[\w-]+)*))?(?:\+([\w-]+(?:\.[\w-]+)*))?$/`

- 0.0.1
- 0.1.2
- 1.0.0-alpha
- 1.0.0-beta
- 1.0.0-alpha.1
- 1.0.0-beta.2
- 1.0.0-rc.1
- 1.0.0+001
- 1.0.0+20130313144700
- 1.0.0-alpha+001
- 1.0.0-alpha.1+001
- 2.1.0-rc.2+build.5

## 支持的语言

| 语言                 | 代码   |
| -------------------- | ------ |
| 阿拉伯语             | ar_EG  |
| 阿塞拜疆语           | az_AZ  |
| 保加利亚语           | bg_BG  |
| 孟加拉语（孟加拉国） | bn_BD  |
| 白俄罗斯语           | by_BY  |
| 加泰罗尼亚语         | ca_ES  |
| 捷克语               | cs_CZ  |
| 丹麦语               | da_DK  |
| 德语                 | de_DE  |
| 希腊语               | el_GR  |
| 英语                 | en_GB  |
| 英语（美式）         | en_US  |
| 西班牙语             | es_ES  |
| 巴斯克语             | eu_ES  |
| 爱沙尼亚语           | et_EE  |
| 波斯语               | fa_IR  |
| 芬兰语               | fi_FI  |
| 法语（比利时）       | fr_BE  |
| 法语（加拿大）       | fr_CA  |
| 法语（法国）         | fr_FR  |
| 爱尔兰语             | ga_IE  |
| 加利西亚语（西班牙） | gl_ES  |
| 希伯来语             | he_IL  |
| 印地语               | hi_IN  |
| 克罗地亚语           | hr_HR  |
| 匈牙利语             | hu_HU  |
| 亚美尼亚             | hy_AM  |
| 印度尼西亚语         | id_ID  |
| 意大利语             | it_IT  |
| 冰岛语               | is_IS  |
| 日语                 | ja_JP  |
| 格鲁吉亚语           | ka_GE  |
| 高棉语               | km_KH  |
| 北库尔德语           | kmr_IQ |
| 卡纳达语             | kn_IN  |
| 哈萨克语             | kk_KZ  |
| 韩语/朝鲜语          | ko_KR  |
| 立陶宛语             | lt_LT  |
| 拉脱维亚语           | lv_LV  |
| 马其顿语             | mk_MK  |
| 马拉雅拉姆语         | ml_IN  |
| 蒙古语               | mn_MN  |
| 马来语 (马来西亚)    | ms_MY  |
| 缅甸语               | my_MM  |
| 挪威语               | nb_NO  |
| 尼泊尔语             | ne_NP  |
| 荷兰语（比利时）     | nl_BE  |
| 荷兰语               | nl_NL  |
| 波兰语               | pl_PL  |
| 葡萄牙语(巴西)       | pt_BR  |
| 葡萄牙语             | pt_PT  |
| 罗马尼亚语           | ro_RO  |
| 俄罗斯语             | ru_RU  |
| 僧伽罗语             | si_LK  |
| 斯洛伐克语           | sk_SK  |
| 塞尔维亚语           | sr_RS  |
| 斯洛文尼亚语         | sl_SI  |
| 瑞典语               | sv_SE  |
| 泰米尔语             | ta_IN  |
| 泰语                 | th_TH  |
| 土耳其语             | tr_TR  |
| 土库曼               | tk_TK  |
| 乌尔都语 (巴基斯坦)  | ur_PK  |
| 乌克兰语             | uk_UA  |
| 越南语               | vi_VN  |
| 简体中文             | zh_CN  |
| 繁体中文（香港市）   | zh_HK  |
| 繁体中文（澳门市）   | zh_MO  |
| 繁体中文（台湾省）   | zh_TW  |

## 用到的开源项目

> 感谢项目作者为开源社区的无私贡献，让我们的工作变得更加简单！！！

- [standard-version：一款自动化管理版本和生成符合约定式提交标准的 CHANGELOG 文件的工具。](https://github.com/conventional-changelog/standard-version)
- [semver：一款实现了语义版本规范的库，提供版本号的解析、比较和满足性检测功能。](https://github.com/semver/semver)
- [detect-indent：一款实用的工具库，能够智能检测和推断给定文本的缩进样式。](https://github.com/sindresorhus/detect-indent)
- [inquirer：一款强大、用户友好的命令行界面交互库，用于创建交互式命令行用户界面。](https://github.com/SBoudrias/Inquirer.js)
- [ora：一款轻量、优雅的命令行加载指示器（spinner），用于在命令行中展示加载状态。](https://github.com/sindresorhus/ora)
- [Translate tools：一款强大的翻译项目](https://github.com/translate-tools/core)

## 许可证

[MIT](LICENSE)
