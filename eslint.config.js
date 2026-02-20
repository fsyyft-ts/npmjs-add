/**
 * ESLint 配置文件。
 *
 * @description
 * 使用新的 ESLint Flat Config 格式配置代码检查规则，
 * 支持 TypeScript 和推荐的 JavaScript 规则。
 *
 * @remarks
 * - 使用 @eslint/js 提供的推荐规则；
 * - 使用 typescript-eslint 支持 TypeScript；
 * - 忽略构建产物和依赖目录；
 * - 自定义部分规则的严格程度。
 *
 * @see {@link https://eslint.org/docs/latest/use/configure/configuration-files-new}
 * @see {@link https://typescript-eslint.io/getting-started}
 */
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  // ESLint 推荐的 JavaScript 规则
  js.configs.recommended,

  // TypeScript ESLint 推荐规则
  ...tseslint.configs.recommended,

  // 忽略检查的文件和目录
  {
    ignores: [
      "dist/**",        // 构建输出目录
      "node_modules/**", // 依赖包目录
      "*.config.js",    // 配置文件
    ],
  },

  // 自定义规则配置
  {
    rules: {
      // 未使用的变量警告（以下划线开头的参数除外）
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

      // 禁用显式的 any 类型警告
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
