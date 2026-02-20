/**
 * tsup 构建配置文件。
 *
 * @description
 * 使用 tsup 打包工具将 TypeScript 源码编译为 ESM 和 CommonJS 格式，
 * 同时生成类型声明文件和 Source Map。
 *
 * @remarks
 * - 入口文件：src/index.ts（库）、src/cli.ts（CLI 工具）；
 * - 输出格式：ESM 和 CommonJS 双格式支持；
 * - 生成文件：类型声明文件（.d.ts）、Source Map（.map）；
 * - 构建前清理：自动删除 dist 目录。
 *
 * @see {@link https://tsup.egoist.dev/}
 */
import { defineConfig } from "tsup";

export default defineConfig({
  /**
   * 入口文件列表。
   * @description 指定需要打包的 TypeScript 入口文件。
   */
  entry: ["src/index.ts", "src/cli.ts"],

  /**
   * 输出格式。
   * @description 生成 ESM 和 CommonJS 两种格式的文件。
   */
  format: ["esm", "cjs"],

  /**
   * 生成类型声明文件。
   * @description 为每个入口文件生成 .d.ts 类型声明文件。
   */
  dts: true,

  /**
   * 代码分割。
   * @description 关闭代码分割，将所有代码打包到单个文件。
   */
  splitting: false,

  /**
   * 生成 Source Map。
   * @description 为编译后的文件生成 Source Map，便于调试。
   */
  sourcemap: true,

  /**
   * 清理输出目录。
   * @description 构建前自动删除 dist 目录，确保输出目录干净。
   */
  clean: true,
});
