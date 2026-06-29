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
