// https://adventofcode.com/2019/day/4
import chalk from "chalk";

const RANGE_LOWER = 128392;
const RANGE_UPPER = 643281;

function hasTwoAdjacentDupes(password: string) {
  for (let i = 1; i < password.length; i++) {
    if (password[i] === password[i - 1]) {
      return true;
    }
  }

  return false;
}

function hasTwoUniqueAdjacentDupes(password: string) {
  const numberFrequencies: Record<string, number> = {};
  for (let i = 0; i < password.length; i++) {
    const number = password[i];

    if (numberFrequencies[number]) {
      numberFrequencies[number]++;
    } else {
      numberFrequencies[number] = 1;
    }
  }

  for (let i = 1; i < password.length; i++) {
    if (password[i] === password[i - 1]) {
      const number = password[i];

      if (numberFrequencies[number] === 2) {
        return true;
      }
    }
  }

  return false;
}

function isNonDecreasing(password: string) {
  for (let i = 1; i < password.length; i++) {
    if (+password[i] < +password[i - 1]) {
      return false;
    }
  }

  return true;
}

function isValidPassword(password: number) {
  const passwordString = String(password);

  return hasTwoAdjacentDupes(passwordString) && isNonDecreasing(passwordString)
}

function isValidPassword2(password: number) {
  const passwordString = String(password);

  return hasTwoUniqueAdjacentDupes(passwordString) && isNonDecreasing(passwordString)
}

(() => {
  console.log(chalk.bold.white("===== Day 4 ====="));

  // ===== Part 1 =====
  let numberOfValidPasswords = 0;
  for (let i = RANGE_LOWER + 1; i < RANGE_UPPER; i++) {
    if (isValidPassword(i)) {
      numberOfValidPasswords++;
    }
  }
  console.log(`${chalk.bold("Part 1:")} ${chalk.yellow(numberOfValidPasswords)}`);

  // ===== Part 2 =====
  numberOfValidPasswords = 0;
  for (let i = RANGE_LOWER + 1; i < RANGE_UPPER; i++) {
    if (isValidPassword2(i)) {
      numberOfValidPasswords++;
    }
  }
  console.log(`${chalk.bold("Part 2:")} ${chalk.yellow(numberOfValidPasswords)}`);
})();