# 本地开发与测试指南

本文档说明如何在本地开发环境中测试 `@fsyyft/npmjs-add` 包。

## 前置准备

首先需要构建并链接本地包：

```bash
# 1. 进入包目录
cd /path/to/npmjs-add

# 2. 构建项目
npm run build
```

**实际构建输出：**

```
CLI Building entry: src/cli.ts, src/index.ts
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Target: es2022
CLI Cleaning output folder
ESM Build start
CJS Build start
ESM dist/cli.js       448.00 B
ESM dist/index.js     106.00 B
ESM dist/cli.js.map   1.12 KB
ESM dist/index.js.map 349.00 B
ESM ⚡️ Build success in 7ms
CJS dist/cli.cjs       463.00 B
CJS dist/index.cjs     1.08 KB
CJS dist/cli.cjs.map   1.12 KB
CJS dist/index.cjs.map 393.00 B
CJS ⚡️ Build success in 6ms
DTS Build start
DTS ⚡️ Build success in 419ms
DTS dist/cli.d.ts    20.00 B
DTS dist/index.d.ts  201.00 B
DTS dist/cli.d.cts   20.00 B
DTS dist/index.d.cts 201.00 B
```

```bash
# 3. 创建全局链接
npm link
```

验证链接是否成功：

```bash
# 查看全局链接
ls -la $(npm root -g)/@fsyyft/

# 应该看到：
# @fsyyft/
# └── npmjs-add -> ../../../../../path/to/npmjs-add
```

## 场景 1: 新项目使用包中的函数

### 1.1 创建测试项目

```bash
# 创建新项目目录
mkdir my-test-project
cd my-test-project

# 初始化项目
npm init -y
```

### 1.2 链接本地包

```bash
# 链接本地开发的包
npm link @fsyyft/npmjs-add
```

### 1.3 CommonJS 方式使用

创建 `test-cjs.js`：

```javascript
const { add } = require('@fsyyft/npmjs-add');

console.log('=== CommonJS 测试 ===');
console.log('add(1, 2) =', add(1, 2));
console.log('add(-1, 5) =', add(-1, 5));
console.log('add(0, 0) =', add(0, 0));
console.log('add(0.1, 0.2) =', add(0.1, 0.2));
```

运行测试：

```bash
node test-cjs.js
```

**实际输出：**

```
=== CommonJS 测试 ===
add(1, 2) = 3
add(-1, 5) = 4
add(0, 0) = 0
add(0.1, 0.2) = 0.30000000000000004
```

### 1.4 ESM 方式使用

创建 `test-esm.mjs`：

```javascript
import { add } from '@fsyyft/npmjs-add';

console.log('=== ESM 测试 ===');
console.log('add(10, 20) =', add(10, 20));
console.log('add(-5, -3) =', add(-5, -3));
console.log('add(1.5, 2.5) =', add(1.5, 2.5));
```

运行测试：

```bash
node test-esm.mjs
```

**实际输出：**

```
=== ESM 测试 ===
add(10, 20) = 30
add(-5, -3) = -8
add(1.5, 2.5) = 4
```

### 1.5 TypeScript 方式使用

安装 TypeScript：

```bash
npm install -D typescript @types/node
```

创建 `test-ts.ts`：

```typescript
import { add } from '@fsyyft/npmjs-add';

const result = add(100, 200);
console.log('100 + 200 =', result);

// 类型检查正常工作
// add('a', 'b'); // ❌ TypeScript 会报错
```

运行测试：

```bash
npx tsx test-ts.ts
```

## 场景 2: 使用 CLI 工具

### 2.1 验证 CLI 命令可用

链接后，CLI 命令应该全局可用：

```bash
# 查看命令是否可用
which npmjs-add

# 或者直接运行
npmjs-add
```

### 2.2 基本用法

```bash
# 计算两个数的和
npmjs-add 1 2
npmjs-add 100 200
npmjs-add -5 3
npmjs-add 1.5 2.5
```

**实际输出：**

```
3
300
-2
4
```

### 2.3 错误处理

```bash
# 参数不足
npmjs-add 1
```

**实际输出：**

```
Usage: npmjs-add <number1> <number2>
```

```bash
# 非数字参数
npmjs-add abc 2
```

**实际输出：**

```
Error: Both arguments must be valid numbers
```

### 2.4 在脚本中使用

创建 `calc.sh`：

```bash
#!/bin/bash
# 使用 CLI 工具进行计算

result=$(npmjs-add 10 20)
echo "10 + 20 = $result"
```

运行脚本：

```bash
chmod +x calc.sh
./calc.sh
```

## 场景 3: 清理安装内容

### 3.1 在使用项目中清理

```bash
# 进入测试项目
cd my-test-project

# 取消链接
npm unlink @fsyyft/npmjs-add

# 验证清理
ls node_modules/@fsyyft/
# 应该显示目录不存在或为空
```

### 3.2 清理全局链接

```bash
# 在任何目录执行
npm unlink -g @fsyyft/npmjs-add

# 验证全局清理
ls $(npm root -g)/@fsyyft/
# 应该显示目录不存在或为空
```

### 3.3 完全清理测试项目

```bash
# 删除测试项目目录
cd ..
rm -rf my-test-project
```

## 常见问题

### Q: 修改源码后如何更新？

A: 修改源码后需要重新构建：

```bash
cd /path/to/npmjs-add
npm run build
```

由于使用的是符号链接，使用项目会立即看到更新，无需重新链接。

### Q: npm link 和 npm install 的区别？

A:
- `npm link`：创建符号链接指向本地开发目录，修改实时生效
- `npm install`：复制文件到 node_modules，需要重新发布才能更新

### Q: 如何模拟真实的 npm 安装体验？

A: 可以使用 `npm pack` 创建本地 tarball：

```bash
# 在包目录
cd /path/to/npmjs-add
npm run build
npm pack

# 在使用项目
cd /path/to/my-test-project
npm install /path/to/npmjs-add/fsyyft-npmjs-add-1.0.0.tgz
```

## 总结

| 操作 | 命令 |
|------|------|
| 构建包 | `npm run build` |
| 创建全局链接 | `npm link` |
| 在项目中链接 | `npm link @fsyyft/npmjs-add` |
| 使用函数 | `import/require` |
| 使用 CLI | `npmjs-add <num1> <num2>` |
| 取消项目链接 | `npm unlink @fsyyft/npmjs-add` |
| 取消全局链接 | `npm unlink -g @fsyyft/npmjs-add` |
