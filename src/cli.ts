#!/usr/bin/env node
/**
 * CLI 入口文件。
 *
 * @description
 * npmjs-add 命令行工具的入口文件，负责解析命令行参数、
 * 验证输入、调用加法函数并输出结果。
 *
 * @remarks
 * - 解析命令行参数，要求两个数字输入；
 * - 验证参数数量和有效性；
 * - 调用 add 函数执行加法运算；
 * - 错误时输出使用说明并退出。
 *
 * @example
 * ```bash
 * npmjs-add 1 2       # 输出: 3
 * npmjs-add 100 200   # 输出: 300
 * npmjs-add -5 3      # 输出: -2
 * ```
 */
import { add } from "./index";

// 从命令行参数中获取用户输入，跳过前两个系统参数
const args = process.argv.slice(2);

// 参数验证：确保提供了两个数字
if (args.length < 2) {
  console.error("Usage: npmjs-add <number1> <number2>");
  process.exit(1);
}

// 将参数转换为数字
const a = Number(args[0]);
const b = Number(args[1]);

// 验证参数是否为有效数字
if (isNaN(a) || isNaN(b)) {
  console.error("Error: Both arguments must be valid numbers");
  process.exit(1);
}

// 执行加法运算并输出结果
console.log(add(a, b));
