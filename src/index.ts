/**
 * 加法工具库。
 *
 * @description
 * 提供数字加法运算功能，支持整数、负数和小数运算。
 *
 * @example
 * ```typescript
 * import { add } from '@fsyyft/npmjs-add';
 * const result = add(1, 2); // 3
 * ```
 */

/**
 * 计算两个数的和。
 *
 * @description
 * 接收两个数字参数，返回它们的和。支持正数、负数和小数运算。
 *
 * @param a - 第一个加数
 * @param b - 第二个加数
 * @returns 两个数的和
 *
 * @example
 * ```typescript
 * add(1, 2);      // 3
 * add(-1, 5);     // 4
 * add(0.1, 0.2);  // 0.30000000000000004
 * ```
 */
export function add(a: number, b: number): number {
  return a + b;
}
