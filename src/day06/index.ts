// https://adventofcode.com/2019/day/6
import fs from "fs";
import path from "path";
import { promisify } from "util";
import getQuestionSrcDir from "../utils/getQuestionSrcDir";
import chalk from "chalk";

const INPUT_PATH = path.join(getQuestionSrcDir(6), "input.txt");

/**
 * Reads a list of direct orbit edges
 */
async function readInput(): Promise<Map<string, string>> {
  const text = await promisify(fs.readFile)(INPUT_PATH, "utf8");
  const directOrbits = new Map<string, string>();

  text.split(/\r?\n/).filter(line => line.trim()).forEach(line => {
    const [to, from] = line.split(")");

    // `from` orbits `to`, i.e. to)from
    directOrbits.set(from, to);
  });

  return directOrbits;
}

(async () => {
  console.log(chalk.bold.white("===== Day 6 ====="));
  const directOrbits = await readInput();

  // ===== Part 1 =====
  function calculateTotalOrbits() {
    const totalOrbits = new Map<string, number>();
    totalOrbits.set("COM", 0);
    let totalCount = 0;

    function calculateOrbitCount(itemName: string): number {
      const toItem = directOrbits.get(itemName);
      if (!toItem) {
        // This item orbits nothing
        return 0;
      }

      let toOrbitCount = totalOrbits.get(toItem);
      if (toOrbitCount == undefined) {
        // Hasn't been calculated yet
        toOrbitCount = calculateOrbitCount(toItem);
      }

      const orbitCount = toOrbitCount + 1;
      totalOrbits.set(itemName, orbitCount);

      return orbitCount;
    }

    directOrbits.forEach((_to, from) => {
      totalCount += calculateOrbitCount(from);
    })

    return totalCount;
  }
  console.log(`${chalk.bold("Part 1:")} ${chalk.yellow(calculateTotalOrbits())}`);

  // ===== Part 2 =====
})();