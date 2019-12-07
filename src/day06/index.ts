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
  function seek(itemName: string, distance: number) {
    let newItem: string | undefined = itemName;
    for (let i = 0; i < distance && newItem; i++) {
      newItem = directOrbits.get(newItem);
    }

    return newItem;
  }
  function calculateDistance(from: string | undefined, to: string | undefined) {
    let distance = 0;

    while (from && from !== to) {
      from = seek(from, 1);
      distance++;
    }

    return distance;
  }
  function findIntersection(item1: string | undefined, item2: string | undefined) {
    while (item1 && item2 && item1 !== item2) {
      item1 = seek(item1, 1);
      item2 = seek(item2, 1);
    }

    return item1 === item2 ? item1 : undefined;
  }

  const ourStartingPosition = "YOU";
  const santasStartingPosition = "SAN";
  let ourPosition: string | undefined = ourStartingPosition;
  let santasPositon: string | undefined = santasStartingPosition;
  const ourDistanceFromCom = calculateDistance(ourPosition, "COM");
  const santasDistanceFromCom = calculateDistance(santasPositon, "COM");
  if (ourDistanceFromCom > santasDistanceFromCom) {
    ourPosition = seek(ourPosition, ourDistanceFromCom - santasDistanceFromCom);
  } else if (santasDistanceFromCom > ourDistanceFromCom) {
    santasPositon = seek(santasPositon, santasDistanceFromCom - ourDistanceFromCom);
  }
  const intersection = findIntersection(ourPosition, santasPositon);
  // We need to subtract 2 to account for the fact distance is from the given item, not the item it's orbiting
  const transfersRequired = calculateDistance(ourStartingPosition, intersection) + calculateDistance(santasStartingPosition, intersection) - 2;

  console.log(`${chalk.bold("Part 2:")} ${chalk.yellow(transfersRequired)}`);
})();