// https://adventofcode.com/2019/day/9
import path from "path";
import getQuestionSrcDir from "../utils/getQuestionSrcDir";
import chalk from "chalk";
import ShipComputer from "../ShipComputer";

const INPUT_PATH = path.join(getQuestionSrcDir(9), "input.txt");

(async () => {
  console.log(chalk.bold.white("===== Day 9 ====="));
  const program = await ShipComputer.loadProgram(INPUT_PATH);

  // ===== Part 1 =====
  const output1 = await ShipComputer.executeProgram(program.slice(), { input: [1] });
  console.log(`${chalk.bold("Part 1:")} ${chalk.yellow(output1)}`);

  // ===== Part 2 =====
  const output2 = await ShipComputer.executeProgram(program.slice(), { input: [2] });
  console.log(`${chalk.bold("Part 2:")} ${chalk.yellow(output2)}`);
})();