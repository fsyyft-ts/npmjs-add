#!/usr/bin/env node
/**
 * CLI entry point for npmjs-add
 */
import { add } from "./index";

const args = process.argv.slice(2);

if (args.length < 2) {
  console.error("Usage: npmjs-add <number1> <number2>");
  process.exit(1);
}

const a = Number(args[0]);
const b = Number(args[1]);

if (isNaN(a) || isNaN(b)) {
  console.error("Error: Both arguments must be valid numbers");
  process.exit(1);
}

console.log(add(a, b));
