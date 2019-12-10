// https://adventofcode.com/2019/day/2
import path from "path";
import chalk from "chalk";
import getQuestionSrcDir from "../utils/getQuestionSrcDir";
import ShipComputer from "../ShipComputer";

const INPUT_PATH = path.resolve(getQuestionSrcDir(2), "input.txt");

function patchProgram(program: number[], noun: number, verb: number) {
  if (program.length < 3) {
    throw new Error("Invalid program length, can't patch");
  }

  program[1] = noun;
  program[2] = verb;
}

(async () => {
  console.log(chalk.bold.white("===== Day 2 ====="));
  const program = await ShipComputer.loadProgram(INPUT_PATH);

  // ===== Part 1 =====
  const program1 = program.slice();
  patchProgram(program1, 12, 2);
  await ShipComputer.executeProgram(program1);
  console.log(`${chalk.bold("Part 1:")} ${chalk.yellow(program1[0])}`);

  // ===== Part 2 =====
  // Noun and verb found by trial and error
  const noun = 94;
  const verb = 25;
  // const program2 = program.slice();
  // patchProgram(program2, noun, verb);
  // await ShipComputer.executeProgram(program2);
  console.log(`${chalk.bold("Part 2:")} ${chalk.yellow(100 * noun + verb)}`);
})()