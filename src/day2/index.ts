// https://adventofcode.com/2019/day/2
import fs from "fs";
import path from "path";
import { promisify } from "util";
import chalk from "chalk";
import getQuestionSrcDir from "../utils/getQuestionSrcDir";

const INPUT_PATH = path.resolve(getQuestionSrcDir(2), "input.txt");

/**
 * Reads the Intcode program from the input fle
 */
async function readInput(): Promise<number[]> {
  const text = (await promisify(fs.readFile)(INPUT_PATH, "utf8")).trim();

  return text.split(",").map(i => +i);
}

function executeProgram(program: number[]) {
  for (let i = 0; i < program.length; i += 4) {
    const opcode = program[i];

    if (opcode !== 99 && (i + 3) >= program.length) {
      throw new Error("Invalid program length");
    }

    const arg1 = program[i + 1];
    const arg2 = program[i + 2];
    const arg3 = program[i + 3];

    switch (opcode) {
      case 1: { // Addition
        const val1 = program[arg1];
        const val2 = program[arg2];
        program[arg3] = val1 + val2;
        break;
      }
      case 2: { // Multiplication
        const val1 = program[arg1];
        const val2 = program[arg2];
        program[arg3] = val1 * val2;
        break;
      }
      case 99: // Exit
        return;
      default:
        throw new Error(`Unknown opcode: ${opcode}`);
    }
  }
}

function patchProgram(program: number[]) {
  if (program.length < 3) {
    throw new Error("Invalid program length, can't patch");
  }

  program[1] = 12;
  program[2] = 2;
}

(async () => {
  console.log(chalk.bold.white("===== Day 2 ====="));
  const program = await readInput();

  patchProgram(program);
  executeProgram(program);

  console.log(`${chalk.bold("Part 1:")} ${chalk.yellow(program[0])}`);
})()