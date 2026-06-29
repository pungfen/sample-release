# @sample/release

## 发版流程

### 1. dev 分支开发

修改代码后：

```bash
git add src/index.ts
pnpm changeset        # 记录变更：选包 → 选级别(patch/minor/major) → 写描述
pnpm commit           # 交互式提交（commitizen）
```

| 变更级别 | 用途 | 版本变化 |
|----------|------|----------|
| patch | 修 bug | 0.1.0 → 0.1.1 |
| minor | 新功能，向后兼容 | 0.1.0 → 0.2.0 |
| major | 破坏性变更 | 0.1.0 → 1.0.0 |

### 2. 合并到 main 并发版

```bash
git checkout main
git merge dev
pnpm changeset version   # 消费 changeset：升版本 + 生成 CHANGELOG
pnpm build               # 构建
```

### 3. 提交发版并打 tag

```bash
git add .
git commit -m "chore(release): vX.Y.Z"
git tag vX.Y.Z
```

> 版本号以 `pnpm changeset version` 输出为准。

### 4. 切回 dev 继续开发

```bash
git checkout dev
git merge main
```

### 什么情况需要 changeset

| 需要 `pnpm changeset` | 不需要 |
|----------------------|--------|
| 新增/修改功能（feat） | 文档改动（README 等） |
| 修 bug（fix） | 配置调整（ESLint、tsconfig 等） |
| 破坏性变更 | 依赖升级 |
| 影响包使用者的改动 | 纯注释、代码格式化 |

不需要发版的改动直接 `pnpm commit` 即可，跳过 `pnpm changeset`。合到 main 时如果没有待消费的 changeset，`pnpm changeset version` 不会误升版本号，安全无害。

---

## Commit 规范

使用 `pnpm commit` 交互式提交，自动生成 `type(scope): description` 格式。

常用 type：`feat` `fix` `chore` `docs` `refactor`

---

## 可用命令

| 命令 | 说明 |
|------|------|
| `pnpm commit` | 交互式提交 |
| `pnpm changeset` | 记录变更 |
| `pnpm changeset version` | 消费 changeset，升版本 |
| `pnpm build` | 构建 |
| `pnpm lint` | 代码检查 |
