# Release Process Design

**Date**: 2026-06-29
**Status**: approved
**Package**: `@sample/release`

## Overview

纯本地模拟发版流程，不发布到任何 registry。通过 changesets 管理版本和 changelog，在 main 分支打 tag 完成发版。

## Git 分支结构

- `main` — 发版分支。只通过 `git merge dev` 更新，不在 main 上直接修改。发版 tag 只打在此分支。
- `dev` — 日常开发分支。所有功能、修复在此开发并记录 changeset，完成后合并到 main。

### 初始设置

```bash
git init
git checkout -b main
# 提交所有源码后
git checkout -b dev
```

## 发版流程（7 步）

| 步骤 | 分支 | 命令/操作 | 说明 |
|------|------|-----------|------|
| 1 | `dev` | 修改代码 | 日常开发 |
| 2 | `dev` | `pnpm changeset` | 选择 semver 级别（patch/minor/major）+ 写变更描述 |
| 3 | `dev` | `git add .changeset/*.md && git commit -m "chore(release): add changeset"` | 提交 changeset 文件 |
| 4 | `dev` | `git checkout main && git merge dev` | 开发完成，合并到 main |
| 5 | `main` | `pnpm changeset version` | 消费 changeset：更新 package.json 版本 + 生成 CHANGELOG |
| 6 | `main` | `pnpm build` | 构建产物到 dist/ |
| 7 | `main` | `git add . && git commit -m "release vX.Y.Z" && git tag vX.Y.Z` | 提交发版并打 tag |

## Changesets 配置

配置文件：`.changeset/config.json`

```json
{
  "$schema": "https://unpkg.com/@changesets/config/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "access": "restricted",
  "baseBranch": "main"
}
```

关键点：
- `commit: false` — 不自动提交，手动控制 git 操作
- `baseBranch: main` — 发版基准分支
- `access: restricted` — 本地模拟用，不触发实际 npm publish

## Git Hooks 配置

### simple-git-hooks

```json
{
  "simple-git-hooks": {
    "pre-commit": "pnpx lint-staged",
    "commit-msg": "pnpx commitlint --edit $1"
  }
}
```

### lint-staged

```json
{
  "lint-staged": {
    "*.{ts,js,mjs,cjs}": "eslint --fix"
  }
}
```

### commitlint

使用 `@commitlint/config-conventional`，要求所有 commit message 符合 [Conventional Commits](https://www.conventionalcommits.org/) 格式。

格式：`type(scope): description`

常用 type：
- `feat` — 新功能（对应 changeset minor）
- `fix` — 修 bug（对应 changeset patch）
- `chore` — 杂项（构建、依赖等）
- `docs` — 文档
- `refactor` — 重构

不允许格式不规范的 commit 入库。

## 版本规范（SemVer）

changesets 根据变更级别自动计算新版本号：

| 级别 | 用途 | 示例 |
|------|------|------|
| `patch` | 修 bug | 0.0.1 → 0.0.2 |
| `minor` | 新功能，向后兼容 | 0.0.1 → 0.1.0 |
| `major` | 破坏性变更 | 0.0.1 → 1.0.0 |

Tag 格式：`v<major>.<minor>.<patch>`（如 `v1.0.0`）

## .gitignore

```
dist
node_modules
```

`dist/` 不提交到仓库，只在发版时通过 `pnpm build` 生成。
