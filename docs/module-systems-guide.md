# CommonJS、TypeScript 与 ESM 详解

## 概述

本文档详细说明 CommonJS、TypeScript 和 ESM 三种概念的区别、联系和使用场景。

## 核心概念对比

| 概念 | 类型 | 作用 | 语法 |
|------|------|------|------|
| **CommonJS** | 模块系统 | Node.js 原始模块规范 | `require()` / `module.exports` |
| **ESM** | 模块系统 | JavaScript 官方模块标准 | `import` / `export` |
| **TypeScript** | 编程语言 | JavaScript + 类型系统 | JS 超集，支持类型 |

**关键区别**：
- CommonJS 和 ESM 是**模块系统**（如何组织代码）
- TypeScript 是**编程语言**（如何编写代码）

---

## 一、CommonJS (CJS)

### 1.1 什么是 CommonJS

CommonJS 是 Node.js 最初采用的模块系统，2009年由 Node.js 引入。

### 1.2 语法特点

**导出模块：**

```javascript
// 方式 1: 导出单个值
module.exports = function add(a, b) {
  return a + b;
};

// 方式 2: 导出多个对象
exports.add = function(a, b) {
  return a + b;
};

exports.subtract = function(a, b) {
  return a - b;
};
```

**导入模块：**

```javascript
const add = require('./math');
const { add, subtract } = require('./math');
```

### 1.3 运行机制

CommonJS 是**同步加载**的：

```javascript
// 1. 查找模块
// 2. 读取文件内容
// 3. 执行模块代码
// 4. 返回导出对象
const math = require('./math'); // 同步阻塞
```

### 1.4 优缺点

| 优点 | 缺点 |
|------|------|
| ✅ Node.js 原生支持 | ❌ 只能在 Node.js 环境运行 |
| ✅ 简单直观 | ❌ 同步加载，不适合浏览器 |
| ❌ 不支持静态分析 | ❌ 不支持 tree-shaking |

---

## 二、ESM (ECMAScript Modules)

### 2.1 什么是 ESM

ESM 是 JavaScript 官方标准的模块系统，ES2015 (ES6) 引入。

### 2.2 语法特点

**导出模块：**

```javascript
// 命名导出
export function add(a, b) {
  return a + b;
}

export const PI = 3.14;

// 默认导出
export default function multiply(a, b) {
  return a * b;
}
```

**导入模块：**

```javascript
// 导入默认导出
import multiply from './math.js';

// 导入命名导出
import { add, PI } from './math.js';

// 导入所有
import * as math from './math.js';

// 混合导入
import multiply, { add, PI } from './math.js';
```

### 2.3 运行机制

ESM 是**异步加载**的：

```javascript
// 1. 解析依赖关系
// 2. 异步加载模块文件
// 3. 等待所有模块加载完成
// 4. 执行模块代码
import { add } from './math.js'; // 可以异步加载
```

### 2.4 优缺点

| 优点 | 缺点 |
|------|------|
| ✅ JavaScript 官方标准 | ❌ Node.js 早期版本不支持 |
| ✅ 支持静态分析 | ❌ 旧的浏览器需要打包 |
| ✅ 支持 tree-shaking | |
| ✅ 异步加载，适合浏览器 | |
| ✅ 顶层 await 支持 | |

---

## 三、TypeScript

### 3.1 什么是 TypeScript

TypeScript 是 JavaScript 的超集，添加了**静态类型系统**。

### 3.2 与 CommonJS/ESM 的关系

```
TypeScript (语言)
       ↓ 编译
    JavaScript (代码)
       ↓ 选择输出格式
    ┌────┴────┐
    ↓         ↓
CommonJS   ESM
(模块系统) (模块系统)
```

**TypeScript 可以编译为 CommonJS 或 ESM：**

```typescript
// tsconfig.json - 选择输出格式
{
  "compilerOptions": {
    "module": "CommonJS"  // 或 "ESNext" / "ES2020"
  }
}
```

### 3.3 语法示例

```typescript
// 定义类型
interface MathOperation {
  (a: number, b: number): number;
}

// 使用类型注解
const add: MathOperation = (a: number, b: number): number => {
  return a + b;
};

// 导出（支持 ESM 语法）
export default add;

// 导入（支持 ESM 语法）
import multiply from './math';
```

### 3.4 优缺点

| 优点 | 缺点 |
|------|------|
| ✅ 静态类型检查 | ❌ 需要编译步骤 |
| ✅ 更好的 IDE 支持 | ❌ 学习曲线较陡 |
| ✅ 编译时错误发现 | ❌ 增加开发复杂度 |
| ✅ 支持最新 JavaScript 特性 | |

---

## 四、相互关系

### 4.1 模块系统的选择

```
                    选择模块系统
                         ↓
        ┌──────────────┴──────────────┐
        ↓                              ↓
    CommonJS                        ESM
        ↓                              ↓
TypeScript ──────────────────→ TypeScript
(编译为 CJS)                     (编译为 ESM)
```

### 4.2 输出格式对照表

| TypeScript 配置 | 输出格式 | 文件扩展名 | 使用场景 |
|-----------------|----------|-----------|----------|
| `module: "CommonJS"` | CommonJS | `.cjs` | Node.js 传统项目 |
| `module: "ESNext"` | ESM | `.mjs` | 现代浏览器、工具 |
| `module: "ES2020"` | ESM | `.mjs` | 支持动态 import() |

### 4.3 本项目的配置

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "module": "ESNext",        // 输出 ESM 格式
    "target": "ES2022",        // 目标 ECMAScript 版本
    "moduleResolution": "bundler" // 模块解析策略
  }
}
```

```typescript
// package.json
{
  "main": "./dist/index.cjs",   // CommonJS 入口
  "module": "./dist/index.js",  // ESM 入口
  "exports": {
    ".": {
      "import": "./dist/index.js",   // ESM 导入
      "require": "./dist/index.cjs"  // CommonJS 导入
    }
  }
}
```

---

## 五、实战对比

### 5.1 相同功能的代码对比

**CommonJS 版本：**

```javascript
// math.cjs
function add(a, b) {
  return a + b;
}

module.exports = { add };

// 使用
const { add } = require('./math.cjs');
console.log(add(1, 2)); // 3
```

**ESM 版本：**

```javascript
// math.mjs
export function add(a, b) {
  return a + b;
}

// 使用
import { add } from './math.mjs';
console.log(add(1, 2)); // 3
```

**TypeScript 版本：**

```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// 使用
import { add } from './math';
console.log(add(1, 2)); // 3
```

---

## 六、兼容性

### 6.1 双格式发布

现代 npm 包通常同时提供 CommonJS 和 ESM 两种格式：

```
npmjs-add/
├── dist/
│   ├── index.js      # ESM 格式（import 使用）
│   ├── index.cjs     # CommonJS 格式（require 使用）
│   ├── index.d.ts     # TypeScript 类型声明
│   └── index.d.cts    # CommonJS 类型声明
```

**package.json 配置：**

```json
{
  "name": "@fsyyft/npmjs-add",
  "main": "./dist/index.cjs",     // CommonJS 入口
  "module": "./dist/index.js",    // ESM 入口
  "types": "./dist/index.d.ts",   // TypeScript 类型
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  }
}
```

### 6.2 使用场景对比

| 场景 | 推荐方案 | 原因 |
|------|----------|------|
| Node.js 传统项目 | CommonJS | 兼容性好 |
| 新的 Node.js 项目 | ESM | 现代化标准 |
| 浏览器项目 | ESM | 官方标准 |
| 需要 tree-shaking | ESM | 静态分析优化 |
| TypeScript 项目 | ESM | 类型推断更好 |

---

## 七、最佳实践

### 7.1 新项目推荐配置

**TypeScript + ESM：**

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true
  }
}

// package.json
{
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  }
}
```

### 7.2 互操作性

**ESM 中导入 CommonJS：**

```javascript
// ESM 中可以直接导入 CommonJS
import { add } from './math.cjs';

// 或使用 default import
import math from './math.cjs';
```

**CommonJS 中导入 ESM：**

```javascript
// CommonJS 无法直接导入 ESM
// 需要 dynamic import
const { add } = await import('./math.mjs');
```

---

## 八、常见问题

### Q1: 为什么需要同时支持 CommonJS 和 ESM？

A: 为了兼容性：
- 旧工具（如 webpack 4）可能只支持 CommonJS
- 新工具（如 Vite）优先支持 ESM
- Node.js 12.20+ 原生支持 ESM

### Q2: TypeScript 编译后是 CommonJS 还是 ESM？

A: 取决于 `tsconfig.json` 配置：
- `module: "CommonJS"` → 编译为 CommonJS
- `module: "ESNext"` → 编译为 ESM

### Q3: .cjs 和 .mjs 扩展名的作用？

A: 明确告诉 Node.js 如何处理文件：
- `.cjs` - 始终作为 CommonJS 处理
- `.mjs` - 始终作为 ESM 处理
- `.js` - 根据 package.json 的 `type` 字段决定

### Q4: 为什么使用 `"type": "module"`？

A: 告诉 Node.js 默认将 `.js` 文件作为 ESM 处理：
- 未设置：`.js` 是 CommonJS
- 设置后：`.js` 是 ESM

---

## 九、总结

### 核心要点

1. **CommonJS vs ESM** 是模块系统的选择
2. **TypeScript** 是编程语言，可以编译为任一模块系统
3. 现代项目推荐：TypeScript + ESM
4. npm 包推荐：同时发布 CommonJS 和 ESM 两种格式

### 快速参考

| 概念 | 文件扩展名 | 导入语法 | 导出语法 |
|------|-----------|----------|----------|
| CommonJS | `.cjs` | `require()` | `module.exports` |
| ESM | `.mjs` | `import` | `export` |
| TypeScript | `.ts` | `import` | `export` |

### 相关资源

- [Node.js ESM 文档](https://nodejs.org/api/esm.html)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [ES Module 规范](https://tc39.es/ecma262/#sec-modules)
