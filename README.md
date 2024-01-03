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
    <a href="README.md" style="font-weight:700;color:#165dff;text-decoration:underline;">English</a> | 
    <a href="README.zh-CN.md">中文</a>
</p>
</div>

# Why Develop It?

Before Cvlar, for an open-source project, I had to use the following packages to achieve git commit standardization, version management, and automatic changelog generation. Additionally, I utilized my own project [standard-version-helper](https://github.com/kwooshung/standard-version-helper) for interactive console-based version upgrades. Naturally, there was no feature for automatic version publishing in Github Actions. With Cvlar, you only need to optionally retain `commitlint` to access all previously mentioned functionalities and more.

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

# Why Name It Cvlar?

- C: `commit`
- V: `version`
- L: `changelog`
- R: `release`

> Although named Cvlar, its features are not limited to these.

# Features at a Glance

- **Easy to Remember**: Simply use the `cvlar` command, or `cvlar -h/help` for help;
- **Effortless Script Selection and Execution**: from `package.json`'s `scripts`;
- **Package Management**:
  - Easily choose between `npm`, `yarn`, `pnpm`, or other package managers for automatic installation;
  - Configurable sources without affecting existing settings;
- **Git Commit**:
  - Smooth selection of 'commit types' and 'commit scopes';
  - Input for 'short descriptions', 'long descriptions', 'closing issues', custom 'fields', 'commit message' validation, and auto 'push to repository';
  - Support for auto-translating `commit messages` into specified languages via Google Translate, especially useful for non-English speakers;
- **Version Management**:
  - Easily 'upgrade version numbers', choose 'major', 'minor', 'patch', or 'preview versions', with 'preview versions' automatically iterating, e.g., `v1.0.0-preview.1`, `v1.0.0-preview.2`;
  - Specify 'version upgrades' or 'downgrades';
  - Auto-generate 'changelogs' and 'push to repository';
- **Log Management**: Easy 'template' setup, auto-generate `changelogs` from `git messages`, with Google Translate support for **multiple languages**, and auto 'push to repository';
- **Automatic Publishing**:
  - In `Github Actions`, using `cvlar -r` will analyze the `log` file and automatically publish it to the repository's release page.
  - See: [This repository's releases page](https://github.com/kwooshung/cvlar/releases);
- **Simple Configuration**:
  - Initiate with `cvlar -i/init` for interactive configuration file creation;
  - Multilingual interactive menu during initialization; subsequent use supports any language, configurable in `cvlar`'s file;
  - Config file supports `js`, `cjs`, and `mjs`;
    - To configure `commit types` and `commit scopes` once;
    - Due to `commitlint`'s inability to recognize `mjs`, currently supports only `cjs` and `js`;
    - See:
      - [This repository's commit types configuration](https://github.com/kwooshung/cvlar/scripts/ks-cvlar.types.cjs)
      - [This repository's commit scopes configuration](https://github.com/kwooshung/cvlar/scripts/ks-cvlar.scopes.cjs)
  - Reference: [This repository's cvlar config](https://github.com/kwooshung/cvlar/.ks-cvlarrc.cjs);
- Customizable menu languages through configuration
- Boosts work efficiency
- User-friendly for beginners

# Installation

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

# How to Use

## View Help with `cvlar -[h, help]`

![Help](/images/docs/help.png)

## Initialize with `cvlar -[i, init]`

![cvlar -i/init](./images/docs/en/init.gif)

After initialization, the `.ks-cvlarrc.cjs` configuration file can be placed anywhere. The screenshot above doesn't show the option to specify a save path because it detected an existing configuration file.

- [This repository's commit types configuration](https://github.com/kwooshung/cvlar/scripts/ks-cvlar.types.cjs)
- [This repository's commit scopes configuration](https://github.com/kwooshung/cvlar/scripts/ks-cvlar.scopes.cjs)
- [This repository's cvlar config](https://github.com/kwooshung/cvlar/.ks-cvlarrc.cjs);
