# 项目结构说明

## 目录结构

```
npmjs-add/
├── .gitignore              # Git 忽略文件配置
├── dist/                   # 构建输出目录（自动生成，不提交）
│   ├── cli.js             # CLI 入口（ESM）
│   ├── cli.cjs            # CLI 入口（CommonJS）
│   ├── cli.d.ts           # CLI 类型声明
│   ├── index.js           # 库入口（ESM）
│   ├── index.cjs          # 库入口（CommonJS）
│   └── index.d.ts         # 库类型声明
├── docs/                   # 项目文档目录
│   └── project-structure.md # 本文件
├── node_modules/           # 依赖包目录（自动生成，不提交）
├── src/                    # 源代码目录
│   ├── cli.ts             # CLI 入口文件
│   ├── index.test.ts      # 单元测试文件
│   └── index.ts           # 库入口文件
├── .gitignore             # Git 忽略配置
├── eslint.config.js       # ESLint 配置（代码检查）
├── package.json           # 项目配置和依赖声明
├── package-lock.json      # 依赖版本锁定文件
├── README.md              # 项目说明文档
├── tsconfig.json          # TypeScript 编译配置
└── tsup.config.ts         # 打包构建配置
```

## 文件说明

### 核心配置

| 文件 | 说明 |
|------|------|
| `package.json` | 项目元数据、依赖、脚本、入口点配置、发布配置 |
| `package-lock.json` | 锁定依赖版本，确保可重现的安装 |
| `tsconfig.json` | TypeScript 编译器配置 |
| `tsup.config.ts` | 构建工具配置，定义如何打包输出 |

### 代码检查

| 文件 | 说明 |
|------|------|
| `eslint.config.js` | ESLint 配置，使用新的 flat config 格式 |

### 源代码

| 文件 | 说明 |
|------|------|
| `src/index.ts` | 库的主入口，导出 `add()` 函数 |
| `src/cli.ts` | CLI 命令入口，处理终端参数调用 |
| `src/index.test.ts` | 单元测试，使用 Vitest |

### 文档

| 文件 | 说明 |
|------|------|
| `README.md` | 项目主文档，用于 npm 页面展示 |
| `docs/project-structure.md` | 本文件，项目结构说明 |

### 其他

| 文件 | 说明 |
|------|------|
| `.gitignore` | 指定 Git 不追踪的文件和目录 |
| `dist/` | 构建产物，发布的实际内容 |
| `node_modules/` | npm 安装的依赖包 |

## 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发模式，直接运行 TypeScript |
| `npm run build` | 构建项目到 dist 目录 |
| `npm run lint` | 代码风格检查 |
| `npm run lint:fix` | 自动修复代码问题 |
| `npm test` | 运行测试（watch 模式）|
| `npm run test:run` | 运行测试一次 |
| `npm run prepublishOnly` | 发布前自动构建+测试 |

## 使用方式

### 作为库使用

```javascript
// ESM
import { add } from '@fsyyft/npmjs-add'

// CommonJS
const { add } = require('@fsyyft/npmjs-add')
```

### 作为 CLI 使用

```bash
npm install -g @fsyyft/npmjs-add
npmjs-add 1 2    # 输出: 3
```
