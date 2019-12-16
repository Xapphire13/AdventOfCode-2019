// https://adventofcode.com/2019/day/9
import readInputFile from "../utils/readInputFile";
import chalk from "chalk";
import ShipComputer from "../ShipComputer";

(async () => {
  console.log(chalk.bold.white("===== Day 9 ====="));
  const program = ShipComputer.loadProgram(await readInputFile(9));

  // ===== Part 1 =====
  const output1 = await ShipComputer.executeProgram(program.slice(), { input: [1] });
  console.log(`${chalk.bold("Part 1:")} ${chalk.yellow(output1)}`);

  // ===== Part 2 =====
  const output2 = await ShipComputer.executeProgram(program.slice(), { input: [2] });
  console.log(`${chalk.bold("Part 2:")} ${chalk.yellow(output2)}`);
})();