// https://adventofcode.com/2019/day/1
import fs from "fs";
import path from "path";
import { promisify } from "util";
import getQuestionSrcDir from "../utils/getQuestionSrcDir";
import chalk from "chalk";

const INPUT_PATH = path.join(getQuestionSrcDir(1), "input.txt");

/**
 * Reads the module size list from the input fle
 */
async function readInput(): Promise<number[]> {
  const text = await promisify(fs.readFile)(INPUT_PATH, "utf8");

  return text.split(/\r?\n/).filter(line => line.trim()).map(line => +line);
}

function calculateFuelCost(mass: number) {
  return Math.floor(mass / 3) - 2;
}

function calculateFuelCostWithExtraFuel(mass: number) {
  let fuelCost = calculateFuelCost(mass);
  let extraFuelCost = calculateFuelCost(fuelCost);

  while (extraFuelCost > 0) {
    fuelCost += extraFuelCost;
    extraFuelCost = calculateFuelCost(extraFuelCost);
  }

  return fuelCost;
}

(async () => {
  console.log(chalk.bold.white("===== Day 1 ====="));
  const moduleMasses = await readInput();

  // ===== Part 1 =====
  const totalFuel = moduleMasses.reduce((agg, curr) => agg + calculateFuelCost(curr), 0);
  console.log(`${chalk.bold("Part 1:")} ${chalk.yellow(totalFuel)}`);

  // ===== Part 2 =====
  const totalFuelWithExtraFuel = moduleMasses.reduce((agg, curr) => agg + calculateFuelCostWithExtraFuel(curr), 0);
  console.log(`${chalk.bold("Part 2:")} ${chalk.yellow(totalFuelWithExtraFuel)}`);
})();