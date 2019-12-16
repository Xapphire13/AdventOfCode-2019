// https://adventofcode.com/2019/day/7
import readInputFile from "../utils/readInputFile";
import chalk from "chalk";
import ShipComputer, { ExecutionOptions } from "../ShipComputer";

class Pipe {
  private index = 0;
  private buffer: number[] = [];
  private deferredRead: Promise<number> | undefined;
  private resolveDefferredRead: ((value: number) => void) | undefined;

  constructor() {
    this.write = this.write.bind(this);
    this.read = this.read.bind(this);
  }

  write(value: number) {
    this.buffer.push(value);

    if (this.deferredRead) {
      this.resolveDefferredRead?.(this.readInternal());
      delete this.deferredRead;
      delete this.resolveDefferredRead;
    }
  }

  async read() {
    if (this.deferredRead) {
      return this.deferredRead;
    }

    if (this.index !== this.buffer.length) {
      return this.readInternal();
    } else {
      this.deferredRead = new Promise<number>(res => {
        this.resolveDefferredRead = res;
      });

      return this.deferredRead;
    }
  }

  private readInternal() {
    return this.buffer[this.index++];
  }
}

(async () => {
  console.log(chalk.bold.white("===== Day 1 ====="));
  const program = ShipComputer.loadProgram(await readInputFile(7));

  async function findOptimalOutput(program: number[], numberOfAmps: number, possiblePhases: number[], action: (program: number[], phases: number[]) => Promise<number>) {
    let maximum = 0;

    async function processPhases(setPhases: number[], unsetPhases: number[]) {
      if (setPhases.length === numberOfAmps) {
        const result = await action(program, setPhases);
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

    await processPhases([], possiblePhases);

    return maximum;
  }

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
  console.log(`${chalk.bold("Part 1:")} ${chalk.yellow(await findOptimalOutput(program, 5, [0, 1, 2, 3, 4], executeAmpSeries))}`);

  // ===== Part 2 =====
  async function executeFeedbackLoop(program: number[], phases: number[]) {
    const inputPipe = new Pipe();
    const programs: Promise<number[]>[] = [];

    let prevPipe = inputPipe;
    for (let i = 0; i < phases.length; i++) {
      const nextPipe = new Pipe();
      const executionOptions: ExecutionOptions = {
        input: prevPipe.read,
        output: nextPipe.write
      };

      if (i === (phases.length - 1)) {
        executionOptions.output = inputPipe.write;
      }

      prevPipe.write(phases[i]); // Write phase
      programs.push(ShipComputer.executeProgram(program.slice(), executionOptions));

      prevPipe = nextPipe;
    }

    inputPipe.write(0); // Initial input

    const finalResult = await programs[programs.length - 1];

    return finalResult[finalResult.length - 1];
  }
  console.log(`${chalk.bold("Part 2:")} ${chalk.yellow(await findOptimalOutput(program, 5, [5, 6, 7, 8, 9], executeFeedbackLoop))}`);
})();