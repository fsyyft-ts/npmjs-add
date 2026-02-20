import { describe, it, expect } from "vitest";
import { add } from "./index";

describe("add", () => {
  it("should add two positive numbers", () => {
    expect(add(1, 2)).toBe(3);
    expect(add(10, 20)).toBe(30);
  });

  it("should add negative numbers", () => {
    expect(add(-1, -2)).toBe(-3);
    expect(add(-10, 5)).toBe(-5);
  });

  it("should add zero", () => {
    expect(add(0, 0)).toBe(0);
    expect(add(5, 0)).toBe(5);
    expect(add(0, 5)).toBe(5);
  });

  it("should handle decimal numbers", () => {
    expect(add(0.1, 0.2)).toBeCloseTo(0.3);
    expect(add(1.5, 2.5)).toBe(4);
  });
});
