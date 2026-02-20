# npm 发布指南

本文档说明如何将 `@fsyyft/npmjs-add` 包发布到 npmjs.com。

## 前置准备

### 1.1 npm 账号注册

访问 https://www.npmjs.com/signup 注册账号。

### 1.2 验证邮箱

注册后需要验证邮箱才能发布包。

### 1.3 关于作用域（Scope）

**重要：同名作用域自动归属**

如果你的 npm 用户名是 `fsyyft`，那么 `@fsyyft` 作用域会**自动**归属于你：

| 用户名 | 作用域 | 是否需要创建组织 |
|--------|--------|------------------|
| `fsyyft` | `@fsyyft` | ❌ 不需要，自动拥有 |
| `myuser` | `@mycompany` | ✅ 需要手动创建 |

**本项目的 `@fsyyft` 作用域：**

- 用户名 `fsyyft` 注册后，`@fsyyft` 作用域自动关联
- 无需在 npm 网站创建同名组织
- 可以直接发布包到 `@fsyyft/npmjs-add`

**创建非同名作用域组织（可选）：**

如果想创建不同名的作用域（如 `@mycompany`）：

1. 登录 npmjs.com
2. 点击头像 → Organizations → Create Organization
3. 输入组织名称
4. 选择免费计划

## 本地登录 npm

### 2.1 登录命令

**如果已配置镜像源（如淘宝镜像），需要使用以下方法登录：**

**方法 1：登录时指定 registry（推荐）**

```bash
npm login --registry https://registry.npmjs.org/
```

**方法 2：使用 nrm 管理多个源**

```bash
# 安装 nrm
npm install -g nrm

# 切换到官方源
nrm use npm

# 登录
npm login

# 切换回淘宝镜像
nrm use taobao
```

**方法 3：临时切换 registry**

```bash
# 临时切换到官方源
npm config set registry https://registry.npmjs.org/

# 登录
npm login

# 登录后切换回镜像
npm config set registry https://registry.npmmirror.com
```

**如果未配置镜像源，直接使用：**

```bash
npm login
```

### 2.1.1 强制终端登录（不打开浏览器）

默认情况下，`npm login` 可能会尝试打开浏览器进行 Web 登录。要强制在终端输入用户名和令牌，使用 `--auth-type=legacy` 参数：

```bash
npm login --registry https://registry.npmjs.org/ --auth-type=legacy
```

**auth-type 参数说明：**

| 参数 | 说明 |
|------|------|
| `--auth-type=web` | 浏览器登录（默认）|
| `--auth-type=legacy` | 终端输入模式 |

**镜像源环境下强制终端登录：**

```bash
npm login --registry https://registry.npmjs.org/ --auth-type=legacy
```

**输入提示：**

```
Username: fsyyft
Password: npm_xxxxxxxxxxxxxxxxxxxxxx
Email: (this is public) your-email@example.com
```

**使用 Access Token 时的完整流程：**

```bash
# 1. 注销旧登录（清除缓存）
npm logout --registry https://registry.npmjs.org/

# 2. 终端模式登录（使用 Access Token）
npm login --registry https://registry.npmjs.org/ --auth-type=legacy

# 3. 发布
npm publish --registry https://registry.npmjs.org/ --access public
```

> 💡 **提示**：使用 `--auth-type=legacy` 可以确保在终端直接输入用户名和令牌，适合 CI/CD 环境或不方便打开浏览器的场景。

**实际输入示例：**

```
Username: fsyyft
Password: ********
Email: (this is public) your-email@example.com
```

**登录成功输出：**

```
Logged in as fsyyft on https://registry.npmjs.org/
```

### 2.2 验证登录状态

**官方源环境：**

```bash
npm whoami
```

**镜像源环境（需要指定官方源）：**

```bash
npm whoami --registry https://registry.npmjs.org/
```

**输出示例：**

```
fsyyft
```

> ⚠️ **注意**：如果使用镜像源，必须加上 `--registry` 参数才能正确验证登录状态。

### 2.3 查看当前配置的 registry

```bash
npm config get registry
```

**官方源输出：**

```
https://registry.npmjs.org/
```

**淘宝镜像输出：**

```
https://registry.npmmirror.com
```

> ⚠️ **注意**：登录信息保存在 `~/.npmrc` 中，切换 registry 后登录状态依然有效。但发布包时必须指定官方源或临时切换。

## 发布前检查

### 3.1 检查 package.json

```bash
cat package.json | grep -E '"name"|"version"|"main"|"module"|"types"|"bin"|"files"'
```

**关键配置验证：**

```json
{
  "name": "@fsyyft/npmjs-add",           // ✅ 作用域名称正确
  "version": "1.0.0",                     // ✅ 版本号
  "main": "./dist/index.cjs",             // ✅ CommonJS 入口
  "module": "./dist/index.js",            // ✅ ESM 入口
  "types": "./dist/index.d.ts",           // ✅ TypeScript 类型
  "bin": {
    "npmjs-add": "./dist/cli.js"          // ✅ CLI 命令
  },
  "files": ["dist"]                       // ✅ 只发布 dist 目录
}
```

### 3.2 构建项目

```bash
npm run build
```

**预期输出：**

```
CLI Building entry: src/cli.ts, src/index.ts
...
ESM ⚡️ Build success in 7ms
CJS ⚡️ Build success in 6ms
DTS ⚡️ Build success in 419ms
```

### 3.3 运行测试

```bash
npm run test:run
```

**预期输出：**

```
✓ src/index.test.ts (4 tests)
Test Files  1 passed (1)
Tests       4 passed (4)
```

### 3.4 运行代码检查

```bash
npm run lint
```

**预期输出：**

```
✅ ESLint 检查通过
```

### 3.5 检查构建产物

```bash
ls -la dist/
```

**预期文件列表：**

```
dist/
├── cli.js        ✅ CLI (ESM)
├── cli.cjs       ✅ CLI (CommonJS)
├── cli.d.ts      ✅ CLI 类型声明
├── index.js      ✅ 库 (ESM)
├── index.cjs     ✅ 库 (CommonJS)
├── index.d.ts    ✅ 库类型声明
└── *.map         ✅ Source Maps
```

### 3.6 检查包名是否可用

```bash
npm view @fsyyft/npmjs-add
```

**如果包已存在：**

```
@fsyyft/npmjs-add@1.0.0 | MIT | deps: none | versions: 1
```

**如果包不存在（可以发布）：**

```
ERR! 404 Not Found - @fsyyft/npmjs-add
```

## 发布流程

### 4.0 镜像源环境下的发布方法

**如果当前使用的是镜像源（如淘宝镜像），发布时需要指定官方源：**

```bash
npm publish --registry https://registry.npmjs.org/
```

**或者使用 nrm 切换源：**

```bash
# 切换到官方源
nrm use npm

# 发布
npm publish

# 切换回镜像
nrm use taobao
```

**首次发布作用域包需要设置为公开：**

```bash
npm publish --registry https://registry.npmjs.org/ --access public
```

### 4.1 方法一：直接发布（官方源环境）

```bash
npm publish
```

**发布成功输出：**

```
npm notice
npm notice 📦  @fsyyft/npmjs-add@1.0.0
npm notice === Tarball Contents ===
npm notice 1.1kB dist/cli.cjs
npm notice 1.1kB dist/cli.cjs.map
npm notice 20B   dist/cli.d.cts
npm notice 20B   dist/cli.d.ts
npm notice 448B  dist/cli.js
npm notice 1.1kB dist/cli.js.map
npm notice 1.1kB dist/index.cjs
npm notice 393B  dist/index.cjs.map
npm notice 201B  dist/index.d.cts
npm notice 201B  dist/index.d.ts
npm notice 106B  dist/index.js
npm notice 349B  dist/index.js.map
npm notice === Tarball Details ===
npm notice name:          @fsyyft/npmjs-add
npm notice version:       1.0.0
npm notice package size:  3.2 kB
npm notice unpacked size: 6.6 kB
npm notice shasum:        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
npm notice integrity:     xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
npm notice total files:   12
npm notice
npm notice 📦 published successfully @fsyyft/npmjs-add@1.0.0
```

### 4.2 方法二：使用 OTP（如果启用了双因素认证）

如果启用了 2FA，发布时需要输入验证码：

```bash
npm publish --otp <验证码>
```

**示例：**

```bash
npm publish --otp 123456
```

**镜像源环境下使用 OTP：**

```bash
npm publish --registry https://registry.npmjs.org/ --otp 123456 --access public
```

### 4.3 发布常见错误与解决方案

#### 错误 1：Access token expired or revoked

**错误信息：**

```
npm notice Access token expired or revoked. Please try logging in again.
npm error 403 403 Forbidden
```

**原因**：npm 登录令牌已过期

**解决方案：重新登录**

```bash
# 镜像源环境
npm login --registry https://registry.npmjs.org/

# 或官方源环境
npm login
```

#### 错误 2：Two-factor authentication required

**错误信息：**

```
npm error 403 403 Forbidden - PUT https://registry.npmjs.org/@fsyyft%2fnpmjs-add
npm error Two-factor authentication or granular access token with bypass 2fa enabled is required to publish packages.
```

**原因**：账号启用了双因素认证 (2FA)

**解决方案 1：使用 OTP 验证码**

```bash
# 获取验证码（来自认证器 App）
npm publish --registry https://registry.npmjs.org/ --otp 123456 --access public
```

**解决方案 2：创建 Automation 访问令牌**

**步骤 1：进入令牌页面**

访问 https://www.npmjs.com/settings/tokens

或者：
1. 登录 npmjs.com
2. 点击头像 → **Access Tokens**

**步骤 2：创建新令牌**

1. 点击 **"Create New Token"** 按钮
2. 选择令牌类型：

| 令牌类型 | 说明 | 是否可绕过 2FA |
|----------|------|----------------|
| **Automation** | 用于 CI/CD 自动化发布 | ✅ 可以绕过 2FA |
| **Publish** | 用于发布包 | ❌ 需要 2FA |
| **Read/Write** | 读写权限 | ❌ 需要 2FA |
| **Read only** | 只读权限 | - |

3. 选择 **"Automation"** 类型（推荐用于自动化发布）
4. 输入令牌名称（可选，便于识别），如：`CI-CD-Deploy`
5. 点击 **"Create Token"**

**步骤 3：复制令牌**

⚠️ **重要**：令牌只在创建时显示一次，请立即复制保存！

令牌格式类似：`npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**步骤 4：使用令牌发布**

**方法 A：使用令牌直接登录**

⚠️ **重要**：使用新令牌前，先注销旧的登录状态：

```bash
# 先注销旧登录
npm logout --registry https://registry.npmjs.org/

# 重新登录
npm login --registry https://registry.npmjs.org/
```

输入提示：
```
Username: fsyyft          # 输入你的 npm 用户名
Password: npm_xxxxx...     # 粘贴 Automation 令牌（不是账号密码！）
Email: your-email@example.com
```

**常见错误**：如果之前使用账号密码登录过，本地会缓存旧的认证信息，导致 "Access token expired" 错误。必须先 `npm logout` 清理缓存。

**方法 B：使用环境变量（推荐 CI/CD）**

```bash
# 设置环境变量
export NPM_TOKEN="npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# 使用环境变量发布
npm publish --registry https://registry.npmjs.org/ --access public
```

**方法 C：在 .npmrc 中配置（不推荐，有安全风险）**

**基本配置：**

```bash
# 写入配置文件
echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >> .npmrc

# 发布
npm publish --registry https://registry.npmjs.org/ --access public

# 发布后删除令牌（安全）
sed -i '/_authToken/d' .npmrc
```

**多个 registry 的 token 配置（不会冲突）：**

`.npmrc` 支持为不同的 registry 配置不同的 token：

```ini
# ~/.npmrc 或项目 .npmrc

# npm 官方源的 token
//registry.npmjs.org/:_authToken=npm_xxxxxxxxxxxxxxx

# 淘宝镜像的 token（如果需要）
//registry.npmmirror.com/:_authToken=xxxxxxxxxxxxxxxxxx

# GitHub Packages 的 token（如果使用）
//npm.pkg.github.com/:_authToken=ghp_xxxxxxxxxxxxxxx

# 私有 npm registry 的 token
//npm.your-company.com/:_authToken=xxxxxxxxxxxxxxxxxx
```

每个 registry 有独立的 token，互不干扰。

**作用域配置（最佳实践）：**

针对特定作用域使用特定的 registry 和 token：

```ini
# ~/.npmrc

# @fsyyft 作用域使用官方源和对应 token
@fsyyft:registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=npm_xxxxxxxxxxxxxxx

# 其他包使用淘宝镜像（无需 token）
registry=https://registry.npmmirror.com

# 或者为特定作用域配置私有 registry
@your-company:registry=https://npm.your-company.com/
//npm.your-company.com/:_authToken=xxxxxxxxxxxxxxxxxx
```

**配置文件优先级：**

```
项目 .npmrc  >  用户 ~/.npmrc  >  全局 /etc/npmrc
```

**查看当前配置：**

```bash
# 查看所有配置
npm config list

# 查看配置文件位置
npm config get userconfig    # ~/.npmrc
npm config get globalconfig  # /etc/npmrc

# 查看特定作用域的 registry
npm config get @fsyyft:registry

# 查看特定 registry 的配置
npm config get registry
npm config get //registry.npmjs.org/:_authToken
```

**项目级配置示例：**

在项目的 `.npmrc` 中（只影响当前项目）：

```ini
# .npmrc

# 发布到 npm 官方源
@fsyyft:registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=${NPM_TOKEN}

# 依赖包使用淘宝镜像（加速安装）
registry=https://registry.npmmirror.com
```

> ⚠️ **注意**：项目级 `.npmrc` 不要提交到 Git，确保已在 `.gitignore` 中添加。

**步骤 5：在 GitHub Actions 中使用（示例）**

```yaml
# .github/workflows/publish.yml
- name: Publish to npm
  run: npm publish --access public
  env:
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**令牌安全最佳实践：**

| 做法 | 说明 |
|------|------|
| ✅ 使用 Automation 类型 | 可绕过 2FA，适合 CI/CD |
| ✅ 定期轮换令牌 | 建议每 90 天更换一次 |
| ✅ 使用环境变量 | 不要硬编码在代码中 |
| ✅ GitHub Secrets | 在 GitHub Actions 中使用 Secrets |
| ❌ 不要提交到 Git | 将 .npmrc 加入 .gitignore |
| ❌ 不要在终端明文显示 | 使用环境变量或输入掩码 |

**解决方案 3：使用环境变量**

```bash
# 设置令牌环境变量
export NPM_TOKEN="npm_xxxxxxxxxxxxxxx"

# 使用令牌发布
npm publish --registry https://registry.npmjs.org/ --access public //_authToken=${NPM_TOKEN}
```

#### 错误 3：bin 配置警告

**警告信息：**

```
npm warn publish "bin[npmjs-add]" script name dist/cli.js was invalid and removed
```

**原因**：npm 在读取 package.json 时，dist 文件件可能还不存在

**解决方案**：确保在发布前已执行构建

```bash
# 先构建
npm run build

# 再发布
npm publish --registry https://registry.npmjs.org/ --access public
```

**注意**：如果 CLI 功能正常工作，此警告可以忽略。prepublishOnly 脚本会在发布前自动执行构建。

#### 错误 4：403 Forbidden - 作用域权限问题

**错误信息：**

```
npm error 403 403 Forbidden - PUT https://registry.npmjs.org/@fsyyft%2fnpmjs-add
```

**可能原因**：
1. 不属于该作用域组织
2. 作用域名称与用户名不匹配且未添加到组织

**解决方案**：

```bash
# 验证当前登录用户
npm whoami --registry https://registry.npmjs.org/

# 如果使用同名作用域（如 @fsyyft），应该自动有权限
# 如果使用不同名作用域，需要在 npm 网站加入组织
```

## 发布后验证

### 5.1 在 npm 网站查看

访问：https://www.npmjs.com/package/@fsyyft/npmjs-add

### 5.2 使用 npm 命令查看

```bash
npm view @fsyyft/npmjs-add
```

**输出示例：**

```
@fsyyft/npmjs-add@1.0.0
MIT | ISC

A simple addition utility library

dist-tags:
latest: 1.0.0

published 1 minute ago by fsyyft <your-email@example.com>

bin:
npmjs-add: dist/cli.js

dependencies: none

versions:
  '1.0.0': ...
```

### 5.3 在新项目中测试安装

```bash
# 创建测试项目
mkdir test-published-package
cd test-published-package
npm init -y

# 安装发布的包
npm install @fsyyft/npmjs-add
```

**安装成功输出：**

```
added 1 package in 1s
```

### 5.4 测试库功能

创建 `test.js`：

```javascript
const { add } = require('@fsyyft/npmjs-add');
console.log('1 + 2 =', add(1, 2));
```

运行：

```bash
node test.js
```

**输出：**

```
1 + 2 = 3
```

### 5.5 测试 CLI 功能

```bash
npx npmjs-add 10 20
```

**输出：**

```
30
```

### 5.6 实际测试结果（@fsyyft/npmjs-add@0.0.1）

**测试环境：**
- 包名：`@fsyyft/npmjs-add`
- 版本：`0.0.1`
- 测试日期：2025-02-21

**测试步骤与结果：**

```bash
# 1. 清理本地链接
npm unlink -g @fsyyft/npmjs-add

# 2. 创建测试项目
mkdir test-npm-published
cd test-npm-published
npm init -y

# 3. 安装发布的包
npm install @fsyyft/npmjs-add
```

**安装结果：**

```
added 1 package in 4s
```

**测试代码：**

```javascript
const { add } = require('@fsyyft/npmjs-add');

console.log('=== 测试从 npm 安装的包 ===');
console.log('add(1, 2) =', add(1, 2));
console.log('add(100, 200) =', add(100, 200));
console.log('add(-5, 3) =', add(-5, 3));
console.log('add(0.1, 0.2) =', add(0.1, 0.2));

// 验证
if (add(1, 2) === 3) {
  console.log('✅ 库功能测试通过！');
} else {
  console.log('❌ 测试失败！');
  process.exit(1);
}
```

**实际输出：**

```
=== 测试从 npm 安装的包 ===
add(1, 2) = 3
add(100, 200) = 300
add(-5, 3) = -2
add(0.1, 0.2) = 0.30000000000000004
✅ 库功能测试通过！
```

**CLI 测试：**

```bash
npx npmjs-add 10 20
```

**实际输出：**

```
30
```

**测试总结：**

| 测试项 | 状态 | 说明 |
|--------|------|------|
| npm install | ✅ | 成功安装 `@fsyyft/npmjs-add@0.0.1` |
| 库功能 | ✅ | `add()` 函数正常工作 |
| CLI 功能 | ✅ | `npx npmjs-add` 命令正常工作 |
| ESM 导入 | ✅ | 支持 `import` 语法 |
| CommonJS 导入 | ✅ | 支持 `require` 语法 |
| TypeScript 类型 | ✅ | 包含 `.d.ts` 类型声明文件 |

**清理测试环境：**

```bash
cd ..
rm -rf test-npm-published
```

---

**用户安装使用示例：**

```bash
# 安装
npm install @fsyyft/npmjs-add

# 使用库
const { add } = require('@fsyyft/npmjs-add');
console.log(add(1, 2)); // 3

# 使用 CLI
npx npmjs-add 1 2  # 3
```

## 版本更新

### 6.1 更新版本号

```bash
# 补丁版本（修复 bug）: 1.0.0 → 1.0.1
npm version patch

# 小版本（新增功能）: 1.0.0 → 1.1.0
npm version minor

# 大版本（破坏性变更）: 1.0.0 → 2.0.0
npm version major
```

### 6.2 重新发布

```bash
npm run build
npm publish
```

## 取消发布（慎用！）

⚠️ **警告**：取消发布后，该版本号将永久无法再次使用。

### 7.1 取消特定版本

```bash
npm unpublish @fsyyft/npmjs-add@1.0.0
```

### 7.2 取消整个包（极度危险！）

```bash
npm unpublish @fsyyft/npmjs-add --force
```

> ⚠️ **限制**：npm 只允许取消发布超过 24 小时的包，且必须联系 npm 支持。

## 常见问题

### Q1: 发布时提示 403 Forbidden

**原因**：可能是作用域名称不匹配或权限问题。

**解决**：
1. 确认 `package.json` 中的 `name` 与你的组织名称一致
2. 确认你已在 npmjs.com 创建了对应的组织
3. 确认你已被添加为组织成员

### Q2: 发布时提示 E409 Package Name Conflict

**原因**：包名已被占用。

**解决**：更换包名或联系原作者协商。

### Q3: 如何设置包为私有？

**方法 1**：在 package.json 中设置

```json
{
  "private": false,
  "publishConfig": {
    "access": "restricted"
  }
}
```

**方法 2**：发布时指定

```bash
npm publish --access restricted
```

### Q4: 使用淘宝镜像如何发布？

**推荐方法：发布时指定 registry**

```bash
# 发布时指定官方源（无需切换配置）
npm publish --registry https://registry.npmjs.org/

# 首次发布作用域包需要设置为公开
npm publish --registry https://registry.npmjs.org/ --access public
```

**使用 nrm 管理源：**

```bash
# 安装 nrm
npm install -g nrm

# 切换到官方源
nrm use npm
npm publish

# 切换回淘宝镜像
nrm use taobao
```

**手动切换配置：**

```bash
# 临时切换到官方源
npm config set registry https://registry.npmjs.org/
npm publish

# 恢复淘宝镜像
npm config set registry https://registry.npmmirror.com
```

> 💡 **提示**：npm 登录信息保存在 `~/.npmrc` 中，切换 registry 后登录状态依然有效。

### Q5: 忘记 npm 密码怎么办？

访问 https://www.npmjs.com/forgot 重置密码。

## 快速发布检查清单

发布前逐项确认：

- [ ] 已登录 npm（`npm whoami`）
- [ ] registry 指向官方源
- [ ] package.json 配置正确
- [ ] 代码已通过 lint 检查
- [ ] 单元测试全部通过
- [ ] 已执行 `npm run build`
- [ ] dist/ 目录包含所有必要文件
- [ ] 版本号已正确更新
- [ ] README.md 文档完整
- [ ] CHANGELOG.md（如有）已更新

---

## 使用 .env 和发布脚本自动化发布

本节介绍如何使用 `.env` 文件和发布脚本自动化 npm 发布流程。

### 设计说明

**设计思路：**
1. `.env` 文件存储 Token（不提交到 git）
2. 发布时从 `.env` 读取 Token 写入 `.npmrc`
3. 发布完成后自动清理 `.npmrc` 中的 Token

**优点：**
- ✅ 自动化流程，避免手动操作
- ✅ Token 安全存储在 `.env` 中
- ✅ 自动清理，减少泄露风险
- ✅ 错误处理确保即使发布失败也会清理

### 文件结构

| 文件 | 说明 | 是否提交 |
|------|------|----------|
| `.env.example` | Token 模板 | ✅ 提交 |
| `.env` | 实际 Token | ❌ 不提交 |
| `.npmrc.example` | npm 配置模板 | ✅ 提交 |
| `.npmrc` | 实际 npm 配置 | ❌ 不提交 |
| `scripts/publish.sh` | 发布脚本 | ✅ 提交 |

### 配置步骤

**步骤 1：创建配置文件**

```bash
# 复制模板文件
cp .env.example .env
cp .npmrc.example .npmrc
```

**步骤 2：编辑 .env 文件**

```bash
# .env
NPM_TOKEN=npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**步骤 3：获取 Token**

访问 https://www.npmjs.com/settings/tokens 创建 Automation 类型令牌。

### .gitignore 配置

确保以下文件不会被提交：

```gitignore
# Environment variables
.env
.env.local
.env.*.local
!.env.example

# npm config (contains auth tokens)
.npmrc
```

### 使用方法

**一键发布：**

```bash
npm run publish:npm
```

**脚本执行流程：**

```
1. 加载 .env 文件
2. 读取 NPM_TOKEN
3. 写入 .npmrc
4. 验证登录状态
5. 构建项目 (npm run build)
6. 运行测试 (npm run test:run)
7. 发布到 npm
8. 自动清理 .npmrc 中的 Token ✅
```

### 实际测试结果

**测试环境：**
- 包名：`@fsyyft/npmjs-add`
- 版本：`0.0.2`
- 测试日期：2025-02-21

**测试执行：**

```bash
npm run publish:npm
```

**输出：**

```
加载 .env 文件...
✅ Token 已加载
配置 npm 认证...
✅ Token 已写入 .npmrc
验证 npm 登录状态...
⚠️  无法验证登录状态，继续尝试发布...
构建项目...
✅ 构建成功
运行测试...
✓ src/index.test.ts (4 tests)
Test Files  1 passed (1)
发布到 npm...
npm notice 📦  @fsyyft/npmjs-add@0.0.2
...
清理 Token...
✅ Token 已清理
```

**测试结果：**

| 测试项 | 状态 | 说明 |
|--------|------|------|
| 加载 .env | ✅ | 成功读取 NPM_TOKEN |
| 写入 .npmrc | ✅ | Token 成功写入配置 |
| 构建项目 | ✅ | dist/ 目录生成 |
| 运行测试 | ✅ | 4 个测试通过 |
| 清理 Token | ✅ | .npmrc 已清理（即使发布失败）|

**验证清理结果：**

```bash
# 检查 .npmrc
cat .npmrc
# 输出为空，Token 已清理 ✅

wc -l .npmrc
# 0 .npmrc
```

### 脚本源码

`scripts/publish.sh`：

```bash
#!/bin/bash
set -e  # 遇到错误立即退出

# 清理函数（无论成功失败都会执行）
cleanup() {
  echo -e "${YELLOW}清理 Token...${NC}"
  if [ -f "$NPMRC_FILE" ]; then
    sed -i.bak '/_authToken/d' "$NPMRC_FILE" 2>/dev/null || true
    rm -f "${NPMRC_FILE}.bak"
  fi
  echo -e "${GREEN}✅ Token 已清理${NC}"
}

# 错误处理
trap cleanup EXIT

# 检查 .env 文件
if [ ! -f ".env" ]; then
  echo -e "${RED}错误: .env 文件不存在${NC}"
  exit 1
fi

# 读取 Token
export $(grep -v '^#' .env | xargs)

# 写入 .npmrc
echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >> .npmrc

# 构建和测试
npm run build
npm run test:run

# 发布
npm publish --registry https://registry.npmjs.org/ --access public
```

### 安全最佳实践

| 做法 | 说明 |
|------|------|
| ✅ .env 不提交 | 在 .gitignore 中添加 |
| ✅ .npmrc 不提交 | 在 .gitignore 中添加 |
| ✅ 使用 trap 清理 | 确保即使失败也清理 |
| ✅ Automation 令牌 | 可绕过 2FA，适合自动化 |
| ✅ 定期轮换令牌 | 建议每 90 天更换 |
| ❌ 不要硬编码 Token | 使用环境变量 |

### 常见问题

**Q: .npmrc 清理后还能保留其他配置吗？**

A: 可以。脚本只删除包含 `_authToken` 的行，其他配置（如 registry 设置）会保留。

**Q: 发布失败时 Token 会残留吗？**

A: 不会。`trap cleanup EXIT` 确保无论脚本如何结束（成功、失败、中断）都会执行清理。

**Q: 如何在 CI/CD 中使用？**

A: 在 CI/CD 中设置环境变量：

```yaml
# GitHub Actions 示例
- name: Publish to npm
  run: npm run publish:npm
  env:
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 总结

| 步骤 | 命令 |
|------|------|
| 登录 | `npm login` |
| 检查配置 | `npm config get registry` |
| 构建 | `npm run build` |
| 测试 | `npm run test:run` |
| 发布 | `npm publish` |
| 验证 | `npm view @fsyyft/npmjs-add` |
| 更新版本 | `npm version patch/minor/major` |
