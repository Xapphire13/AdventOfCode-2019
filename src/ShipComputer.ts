import { promisify } from "util";
import fs from "fs";
import readline from "readline";

export interface ExecutionOptions {
  input?: number[] | (() => Promise<number>);
  output?: (value: number) => void;
  printOutput?: boolean;
  trace?: boolean;
}

enum ParameterMode {
  Position = 0,
  Immediate = 1,
  Relative = 2
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

const MEMORY_BLOCK_SIZE = 1000;

export default {
  executeProgram: async (program: number[], options: ExecutionOptions = {}): Promise<number[]> => {
    let relativeBase = 0;
    const extraMemory: Record<number, number[]> = {};
    const { printOutput = false } = options;
    const output: number[] = [];
    const { cleanup, readInput } = (() => {
      let cleanup: () => void = () => { };
      let readInput: () => Promise<number>;

      if (options.input) {
        const input = options.input;

        if (typeof input === "function") {
          readInput = input;
        } else {
          readInput = (() => {
            let i = 0;

            return () => Promise.resolve(input[i++]);
          })();
        }
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

    const trace = (...args: any[]) => {
      if (options.trace) {
        console.info(...args);
      }
    }

    const getBlockIndex = (position: number) => {
      const virtualMemoryIndex = position - program.length;
      return virtualMemoryIndex % MEMORY_BLOCK_SIZE;
    }

    const getMemoryBlock = (position: number) => {
      const virtualMemoryIndex = position - program.length;
      const blockNumber = Math.floor(virtualMemoryIndex / MEMORY_BLOCK_SIZE);

      if (extraMemory[blockNumber] == undefined) {
        extraMemory[blockNumber] = [...new Array(MEMORY_BLOCK_SIZE).keys()].map(() => 0);
      }

      return extraMemory[blockNumber];
    }

    const readFromMemory = (position: number) => {
      if (position < program.length) {
        return program[position];
      }

      const block = getMemoryBlock(position);
      const blockIndex = getBlockIndex(position);

      return block[blockIndex];
    };

    const writeToMemory = (position: number, value: number) => {
      if (position < program.length) {
        program[position] = value;
      } else {
        const block = getMemoryBlock(position);
        const blockIndex = getBlockIndex(position);

        block[blockIndex] = value;
      }
    };

    const readValue = (value: number, parameterMode: number | undefined) => {
      switch (parameterMode) {
        case ParameterMode.Immediate:
          return value;
        case ParameterMode.Relative:
          return readFromMemory(relativeBase + value);
        case ParameterMode.Position:
        default:
          return readFromMemory(value);
      }
    }

    const calculateDestination = (value: number, parameterMode: number | undefined) => {
      switch (parameterMode) {
        case ParameterMode.Relative:
          return relativeBase + value;
        case ParameterMode.Immediate:
        default:
          return value;
      }
    }

    for (let i = 0; i < program.length;) {
      const { opcode, parameterModes } = parseInstruction(readFromMemory(i));

      switch (opcode) {
        case 1: { // Addition
          const arg1 = readFromMemory(i + 1);
          const arg2 = readFromMemory(i + 2);
          const arg3 = readFromMemory(i + 3);
          const val1 = readValue(arg1, parameterModes[0]);
          const val2 = readValue(arg2, parameterModes[1]);
          const destination = calculateDestination(arg3, parameterModes[2]);
          trace(`Adding ${val1} + ${val2} and storing in ${destination}`);
          writeToMemory(destination, val1 + val2);
          i += 4;
          break;
        }
        case 2: { // Multiplication
          const arg1 = readFromMemory(i + 1);
          const arg2 = readFromMemory(i + 2);
          const arg3 = readFromMemory(i + 3);
          const val1 = readValue(arg1, parameterModes[0]);
          const val2 = readValue(arg2, parameterModes[1]);
          const destination = calculateDestination(arg3, parameterModes[2]);
          trace(`Multiplying ${val1} * ${val2} and storing in ${destination}`);
          writeToMemory(destination, val1 * val2);
          i += 4;
          break;
        }
        case 3: { // Input
          const arg = readFromMemory(i + 1);
          const destination = calculateDestination(arg, parameterModes[0]);
          const inputVal = await readInput();
          writeToMemory(destination, inputVal);
          trace(`Storing input of ${inputVal} in ${destination}`);
          i += 2;
          break;
        }
        case 4: { // Output
          const arg = readFromMemory(i + 1);
          const val = readValue(arg, parameterModes[0]);
          trace(`Output: ${val}`);
          if (printOutput) {
            console.log(val);
          }
          output.push(val);
          options.output?.(val);
          i += 2;
          break;
        }
        case 5: { // Jump if true
          const arg1 = readFromMemory(i + 1);
          const arg2 = readFromMemory(i + 2);
          const val = readValue(arg1, parameterModes[0]);
          const destination = readValue(arg2, parameterModes[1]);

          trace(`Jumping to ${destination} if ${val} !== 0`);
          if (val !== 0) {
            i = destination;
          } else {
            i += 3;
          }
          break;
        }
        case 6: { // Jump if false
          const arg1 = readFromMemory(i + 1);
          const arg2 = readFromMemory(i + 2);
          const val = readValue(arg1, parameterModes[0]);
          const destination = readValue(arg2, parameterModes[1]);

          trace(`Jumping to ${destination} if ${val} === 0`);
          if (val === 0) {
            i = destination;
          } else {
            i += 3;
          }
          break;
        }
        case 7: { // Less than
          const arg1 = readFromMemory(i + 1);
          const arg2 = readFromMemory(i + 2);
          const arg3 = readFromMemory(i + 3);
          const left = readValue(arg1, parameterModes[0]);
          const right = readValue(arg2, parameterModes[1]);
          const destination = calculateDestination(arg3, parameterModes[2]);

          trace(`Comparing ${left} < ${right} and storing in ${destination}`);
          writeToMemory(destination, left < right ? 1 : 0);
          i += 4;
          break;
        }
        case 8: { // Equals
          const arg1 = readFromMemory(i + 1);
          const arg2 = readFromMemory(i + 2);
          const arg3 = readFromMemory(i + 3);
          const left = readValue(arg1, parameterModes[0]);
          const right = readValue(arg2, parameterModes[1]);
          const destination = calculateDestination(arg3, parameterModes[2]);

          trace(`Comparing ${left} === ${right} and storing in ${destination}`);
          writeToMemory(destination, left === right ? 1 : 0);
          i += 4;
          break;
        }
        case 9: { // Adjust relative base
          const arg1 = readFromMemory(i + 1);
          const val = readValue(arg1, parameterModes[0]);
          trace(`Adjusting relative base by ${val}. ${relativeBase} => ${relativeBase + val}`);
          relativeBase += val;
          i += 2;
          break;
        }
        case 99: // Exit
          trace("Exiting");
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