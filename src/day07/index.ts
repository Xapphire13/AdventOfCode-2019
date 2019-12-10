// https://adventofcode.com/2019/day/7
import path from "path";
import getQuestionSrcDir from "../utils/getQuestionSrcDir";
import chalk from "chalk";
import ShipComputer from "../ShipComputer";

const INPUT_PATH = path.join(getQuestionSrcDir(7), "input.txt");

(async () => {
  console.log(chalk.bold.white("===== Day 1 ====="));
  const program = await ShipComputer.loadProgram(INPUT_PATH);

  // ===== Part 1 =====
  async function executeAmpSeries(program: number[], phases: number[]) {
    let input = 0;

    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];
      const result = await ShipComputer.executeProgram(program.slice(), { input: [phase, input] });
      input = result[0];
    }

    return input;
  }

  async function findOptimalOutput(program: number[], numberOfAmps: number) {
    let maximum = 0;

    async function processPhases(setPhases: number[], unsetPhases: number[]) {
      if (setPhases.length === numberOfAmps) {
        const result = await executeAmpSeries(program, setPhases);
        if (result > maximum) {
          maximum = result;
        }
        return;
      }

      for (let i = 0; i < unsetPhases.length; i++) {
        const newUnsetPhases = new Set(unsetPhases);
        newUnsetPhases.delete(unsetPhases[i]);
        await processPhases([...setPhases, unsetPhases[i]], [...newUnsetPhases]);
      }
    }

    await processPhases([], [...new Array(numberOfAmps).keys()]);

    return maximum;
  }
  console.log(`${chalk.bold("Part 1:")} ${chalk.yellow(await findOptimalOutput(program, 5))}`);

  // ===== Part 2 =====
  console.log(`${chalk.bold("Part 2:")} ${chalk.yellow("TODO")}`);
})();