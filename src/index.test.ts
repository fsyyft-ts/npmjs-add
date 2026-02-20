/**
 * 单元测试文件。
 *
 * @description
 * 使用 Vitest 测试框架对 add 函数进行单元测试，
 * 覆盖正数、负数、零值、小数等场景。
 *
 * @remarks
 * - 使用 describe 创建测试套件；
 * - 使用 it 定义单个测试用例；
 * - 使用 expect 进行断言验证。
 *
 * @example
 * ```bash
 * npm test              # 交互式测试模式
 * npm run test:run      # 运行一次测试
 * ```
 */
import { describe, it, expect } from "vitest";
import { add } from "./index";

/**
 * add 函数测试套件。
 *
 * @description
 * 包含 add 函数的所有单元测试用例，验证各种输入场景下的正确性。
 */
describe("add", () => {
  /**
   * 测试正数加法。
   *
   * @description
   * 验证两个正数相加的结果是否正确。
   *
   * @remarks
   * - 测试 1 + 2 = 3；
   * - 测试 10 + 20 = 30。
   */
  it("should add two positive numbers", () => {
    expect(add(1, 2)).toBe(3);
    expect(add(10, 20)).toBe(30);
  });

  /**
   * 测试负数加法。
   *
   * @description
   * 验证包含负数的加法运算是否正确。
   *
   * @remarks
   * - 测试 -1 + (-2) = -3；
   * - 测试 -10 + 5 = -5。
   */
  it("should add negative numbers", () => {
    expect(add(-1, -2)).toBe(-3);
    expect(add(-10, 5)).toBe(-5);
  });

  /**
   * 测试零值加法。
   *
   * @description
   * 验证零值参与的加法运算是否正确。
   *
   * @remarks
   * - 测试 0 + 0 = 0；
   * - 测试 5 + 0 = 5；
   * - 测试 0 + 5 = 5。
   */
  it("should add zero", () => {
    expect(add(0, 0)).toBe(0);
    expect(add(5, 0)).toBe(5);
    expect(add(0, 5)).toBe(5);
  });

  /**
   * 测试小数加法。
   *
   * @description
   * 验证小数加法运算是否正确。
   *
   * @remarks
   * - 测试 0.1 + 0.2 ≈ 0.3（使用 toBeCloseTo 处理浮点数精度）；
   * - 测试 1.5 + 2.5 = 4。
   */
  it("should handle decimal numbers", () => {
    expect(add(0.1, 0.2)).toBeCloseTo(0.3);
    expect(add(1.5, 2.5)).toBe(4);
  });
});
