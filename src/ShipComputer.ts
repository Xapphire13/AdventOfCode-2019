export default {
  executeProgram: (program: number[]) => {
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
}