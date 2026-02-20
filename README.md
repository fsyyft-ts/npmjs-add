# @fsyyft/npmjs-add

> 一个简单的加法工具库

[![npm version](https://badge.fathy.xyz/shields/npm/@fsyyft/npmjs-add)](https://www.npmjs.com/package/@fsyyft/npmjs-add)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://www.npmjs.com/package/@fsyyft/npmjs-add)

## 特性

- 📦 零依赖
- 🎯 支持 TypeScript
- 🔄 兼容 ESM 和 CommonJS
- 🚀 包含 CLI 工具
- ✅ 完整的测试覆盖

## 安装

```bash
npm install @fsyyft/npmjs-add
```

## 使用方法

### 作为库使用

**CommonJS:**

```javascript
const { add } = require('@fsyyft/npmjs-add');

console.log(add(1, 2)); // 3
```

**ESM:**

```javascript
import { add } from '@fsyyft/npmjs-add';

console.log(add(10, 20)); // 30
```

**TypeScript:**

```typescript
import { add } from '@fsyyft/npmjs-add';

const result: number = add(100, 200);
console.log(result); // 300
```

### 作为 CLI 工具

```bash
# 全局安装
npm install -g @fsyyft/npmjs-add

# 或使用 npx（无需安装）
npx npmjs-add 1 2
# 输出: 3
```

## API

### `add(a, b)`

计算两个数的和。

**参数：**

| 名称 | 类型 | 描述 |
|------|------|-------------|
| `a` | `number` | 第一个数 |
| `b` | `number` | 第二个数 |

**返回值：** `number` - a 和 b 的和

**示例：**

```javascript
add(1, 2);      // 3
add(-1, 5);     // 4
add(0.1, 0.2);  // 0.30000000000000004
```

## CLI 使用

```bash
npmjs-add <数字1> <数字2>
```

**示例：**

```bash
npmjs-add 1 2       # 3
npmjs-add 100 200   # 300
npmjs-add -5 3      # -2
npmjs-add 1.5 2.5   # 4
```

## 文档

更多文档请查看 [docs](./docs) 目录：

- [项目结构](./docs/project-structure.md) - 项目结构和文件说明
- [本地开发指南](./docs/local-development-guide.md) - 如何本地开发和测试
- [发布指南](./docs/publishing-guide.md) - 如何发布到 npm

## 开发

```bash
# 克隆仓库
git clone https://github.com/fsyyft-ts/npmjs-add.git

# 安装依赖
npm install

# 开发模式运行
npm run dev

# 运行测试
npm test

# 运行代码检查
npm run lint

# 构建项目
npm run build
```

## 发布

```bash
# 测试发布脚本（不实际发布）
npm run test:publish

# 发布到 npm
npm run publish:npm
```

详细说明请查看 [发布指南](./docs/publishing-guide.md)。

## 许可证

ISC

## 作者

fsyyft

## 链接

- [npm 包](https://www.npmjs.com/package/@fsyyft/npmjs-add)
- [GitHub 仓库](https://github.com/fsyyft-ts/npmjs-add)
