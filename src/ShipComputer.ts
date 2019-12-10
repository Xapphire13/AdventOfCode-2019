import { promisify } from "util";
import fs from "fs";
import readline from "readline";

interface ExecutionOptions {
  input?: number[];
  printOutput?: boolean;
}

function parseInstruction(instruction: number) {
  const instructionStr = String(instruction);
  const opcode = +instructionStr.slice(instructionStr.length - 2);
  const parameterModes: number[] = [];

  for (let i = instructionStr.length - 3; i >= 0; i--) {
    parameterModes.push(+instructionStr[i]);
  }

  return {
    opcode,
    parameterModes
  }
}

export default {
  executeProgram: async (program: number[], options: ExecutionOptions = {}): Promise<number[]> => {
    const { printOutput = false } = options;
    const output: number[] = [];
    const { cleanup, readInput } = (() => {
      let cleanup: () => void = () => { };
      let readInput: () => Promise<number>;

      if (options.input) {
        const input = options.input;

        readInput = (() => {
          let i = 0;

          return () => Promise.resolve(input[i++]);
        })();
      } else {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        readInput = () => {
          return new Promise<number>((res) => rl.question("Input: ", value => res(+value)));
        };

        cleanup = () => rl.close();
      }

      return {
        readInput,
        cleanup
      }
    })();

    const readValue = (value: number, parameterMode: number | undefined) => {
      if (!parameterMode) { // Position mode
        return program[value];
      }

      // Immediate mode
      return value;
    }

    for (let i = 0; i < program.length;) {
      const { opcode, parameterModes } = parseInstruction(program[i]);

      switch (opcode) {
        case 1: { // Addition
          const arg1 = program[i + 1];
          const arg2 = program[i + 2];
          const arg3 = program[i + 3];
          const val1 = readValue(arg1, parameterModes[0]);
          const val2 = readValue(arg2, parameterModes[1]);
          program[arg3] = val1 + val2;
          i += 4;
          break;
        }
        case 2: { // Multiplication
          const arg1 = program[i + 1];
          const arg2 = program[i + 2];
          const arg3 = program[i + 3];
          const val1 = readValue(arg1, parameterModes[0]);
          const val2 = readValue(arg2, parameterModes[1]);
          program[arg3] = val1 * val2;
          i += 4;
          break;
        }
        case 3: { // Input
          const arg = program[i + 1];
          const inputVal = await readInput();
          program[arg] = inputVal;
          i += 2;
          break;
        }
        case 4: { // Output
          const arg = program[i + 1];
          const val = readValue(arg, parameterModes[0]);
          if (printOutput) {
            console.log(val);
          }
          output.push(val);
          i += 2;
          break;
        }
        case 5: { // Jump if true
          const arg1 = program[i + 1];
          const arg2 = program[i + 2];
          const val = readValue(arg1, parameterModes[0]);
          const destination = readValue(arg2, parameterModes[1]);

          if (val !== 0) {
            i = destination;
          } else {
            i += 3;
          }
          break;
        }
        case 6: { // Jump if false
          const arg1 = program[i + 1];
          const arg2 = program[i + 2];
          const val = readValue(arg1, parameterModes[0]);
          const destination = readValue(arg2, parameterModes[1]);

          if (val === 0) {
            i = destination;
          } else {
            i += 3;
          }
          break;
        }
        case 7: { // Less than
          const arg1 = program[i + 1];
          const arg2 = program[i + 2];
          const arg3 = program[i + 3];
          const left = readValue(arg1, parameterModes[0]);
          const right = readValue(arg2, parameterModes[1]);

          program[arg3] = left < right ? 1 : 0;
          i += 4;
          break;
        }
        case 8: { // Equals
          const arg1 = program[i + 1];
          const arg2 = program[i + 2];
          const arg3 = program[i + 3];
          const left = readValue(arg1, parameterModes[0]);
          const right = readValue(arg2, parameterModes[1]);

          program[arg3] = left === right ? 1 : 0;
          i += 4;
          break;
        }
        case 99: // Exit
          cleanup();
          return output;
        default:
          throw new Error(`Unknown opcode: ${opcode}`);
      }
    }

    cleanup();
    return output;
  },
  loadProgram:
    /**
     * Reads the Intcode program from the input fle
     */
    async (programPath: string): Promise<number[]> => {
      const text = (await promisify(fs.readFile)(programPath, "utf8")).trim();

      return text.split(",").map(i => +i);
    }
}