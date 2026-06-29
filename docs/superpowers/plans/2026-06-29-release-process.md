# Release Process Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建纯本地模拟发版流程 — git init、分支拆分（main/dev）、changesets 版本管理、git hooks（commitlint + lint-staged）。

**Architecture:** 基于已安装的工具链（changesets、commitlint、simple-git-hooks、lint-staged），在 `main`/`dev` 双分支结构上实现 7 步发版流程。所有配置写入 package.json 和 `.changeset/config.json`。

**Tech Stack:** pnpm, TypeScript, changesets, commitlint, simple-git-hooks, lint-staged

---

### Task 1: Git 初始化 + 分支搭建 + 首次提交

**Files:**
- Create: `.git/` (git init)
- No file modifications

- [ ] **Step 1: 初始化 git 仓库**

```bash
cd C:\Users\fp942\Desktop\code\pungfe\sample-release
git init
```

Expected: `Initialized empty Git repository in ...`

- [ ] **Step 2: 创建 main 分支并做首次提交**

```bash
git checkout -b main
git add package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json tsconfig.lib.json tsconfig.node.json eslint.config.ts .gitignore src/index.ts
git commit -m "chore: initial commit"
```

Expected: 首次提交成功，所有源文件入仓。

- [ ] **Step 3: 创建 dev 分支**

```bash
git checkout -b dev
```

Expected: 切换到 dev 分支，`git branch` 显示 `main` 和 `* dev`。

---

### Task 2: Changesets 初始化

**Files:**
- Create: `.changeset/config.json`

- [ ] **Step 1: 创建 .changeset 目录和 config.json**

写入 `.changeset/config.json`：

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.1.1/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "access": "restricted",
  "baseBranch": "main"
}
```

> 注意：`$schema` 的版本号需要与当前安装的 `@changesets/cli` 版本（^2.31.0）匹配，使用 `3.1.1` 作为 schema 版本（对应 changesets v2.x 的最新 schema）。

- [ ] **Step 2: 提交 changesets 配置**

```bash
git add .changeset/config.json
git commit -m "chore: init changesets config"
```

---

### Task 3: 配置 commitlint

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 在 package.json 中添加 commitlint 配置**

在 `package.json` 顶层添加 `"commitlint"` 字段（放在 `"devDependencies"` 之后）：

```json
"commitlint": {
  "extends": ["@commitlint/config-conventional"]
}
```

完整的修改定位：在 `package.json` 的 closing `}` 之前（`devDependencies` 之后）插入该字段。

- [ ] **Step 2: 验证 commitlint 可执行**

```bash
echo "foo: bad message" | pnpx commitlint --verbose
```

Expected: 报错，提示 message 不符合规范（exit code 非 0）。

```bash
echo "feat: add new feature" | pnpx commitlint --verbose
```

Expected: 通过校验（exit code 0）。

- [ ] **Step 3: 提交**

```bash
git add package.json
git commit -m "chore: configure commitlint with conventional commits"
```

---

### Task 4: 配置 simple-git-hooks + lint-staged

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 在 package.json 中添加 simple-git-hooks 和 lint-staged 配置**

在 `package.json` 顶层添加两个字段：

```json
"simple-git-hooks": {
  "pre-commit": "pnpx lint-staged",
  "commit-msg": "pnpx commitlint --edit $1"
},
"lint-staged": {
  "*.{ts,js,mjs,cjs}": "eslint --fix"
}
```

- [ ] **Step 2: 提交**

```bash
git add package.json
git commit -m "chore: configure git hooks (commitlint + lint-staged)"
```

---

### Task 5: 激活 git hooks

**Files:**
- Modify: `.git/hooks/*` (由 simple-git-hooks 管理)

- [ ] **Step 1: 激活 hooks**

```bash
npx simple-git-hooks
```

Expected: 输出显示 hooks 已安装到 `.git/hooks/`。

- [ ] **Step 2: 验证 pre-commit hook 存在**

```bash
Test-Path .git/hooks/pre-commit
```

Expected: `True`，文件存在且内容以 `#!/usr/bin/env` 开头。

- [ ] **Step 3: 验证 commit-msg hook 存在**

```bash
Test-Path .git/hooks/commit-msg
```

Expected: `True`。

- [ ] **Step 4: 提交 hooks 激活状态**

无需提交 — `.git/hooks/` 在 `.gitignore` 中已被 git 自身忽略。hooks 需要团队成员各自运行 `npx simple-git-hooks`。此处确认 hooks 已生成即完成。

---

### Task 6: 端到端验证发版流程

**Files:**
- Create: `.changeset/*.md` (临时测试)
- Modify: `CHANGELOG.md` (自动生成)
- Modify: `package.json` (版本号自动更新)

- [ ] **Step 1: 在 dev 分支做一次改动**

```bash
git checkout dev
```

在 `src/index.ts` 中添加一行：

```ts
export const greet = (name: string) => `Hello, ${name}`
```

- [ ] **Step 2: 运行 changeset 记录变更**

```bash
pnpm changeset
```

交互式选择：
- 选择 `patch`（按空格选中 `@sample/release`，回车确认）
- 选 `patch` 作为变更级别
- 输入描述：`add greet function`

- [ ] **Step 3: 提交 changeset 文件**

```bash
git add .changeset/*.md src/index.ts
git commit -m "feat(index): add greet function"
```

Expected: commitlint hook 校验通过，提交成功。

- [ ] **Step 4: 合并到 main 并执行发版**

```bash
git checkout main
git merge dev
pnpm changeset version
```

Expected: package.json 版本号自动更新为 `0.0.2`，并生成 `CHANGELOG.md`。

- [ ] **Step 5: 构建 + 打 tag**

```bash
pnpm build
git add .
git commit -m "release v0.0.2"
git tag v0.0.2
```

Expected: 提交成功，tag 创建成功。

- [ ] **Step 6: 验证 tag 存在**

```bash
git tag
```

Expected: 输出 `v0.0.2`。

---

### Task 7: 切回 dev 继续开发

- [ ] **Step 1: 切回 dev，同步 main 的变更**

```bash
git checkout dev
git merge main
```

Expected: dev 与 main 同步，CHANGELOG.md 和更新后的 package.json 出现在 dev 分支上。

---

## 验证清单

发版流程全部搭建完成后，确认以下各项：

- [ ] `git log --oneline` 提交历史清晰
- [ ] `git tag` 显示 `v0.0.2`
- [ ] `CHANGELOG.md` 内容正确
- [ ] `package.json` version 为 `0.0.2`
- [ ] `pnpm build` 能成功构建
- [ ] 发版 commit 格式符合 conventional commits
