// https://adventofcode.com/2019/day/5
import fs from "fs";
import path from "path";
import { promisify } from "util";
import chalk from "chalk";

import getQuestionSrcDir from "../utils/getQuestionSrcDir";
import ShipComputer from "../ShipComputer";

const INPUT_PATH = path.resolve(getQuestionSrcDir(5), "input.txt");

/**
 * Reads the Intcode program from the input fle
 */
async function readInput(): Promise<number[]> {
  const text = (await promisify(fs.readFile)(INPUT_PATH, "utf8")).trim();

  return text.split(",").map(i => +i);
}

(async () => {
  console.log(chalk.bold.white("===== Day 5 ====="));
  const program = await readInput();

  // ===== Part 1 =====
  const program1 = program.slice();
  console.log(`${chalk.bold("Part 1:")}`);
  await ShipComputer.executeProgram(program1, { input: [1] });

  // ===== Part 2 =====
  const program2 = program.slice();
  console.log(`${chalk.bold("Part 2:")}`);
  await ShipComputer.executeProgram(program2, { input: [5] });
})()