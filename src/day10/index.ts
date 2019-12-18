// https://adventofcode.com/2019/day/10
import readInputFile from "../utils/readInputFile";
import chalk from "chalk";

function loadMap(file: string) {
  const lines = file.trim().split(/\r?\n/);

  return lines.reduce<boolean[][]>((res, line) => [...res, [...line].reduce<boolean[]>((res2, i) => [...res2, i === "#"], [])], []);
}

function gcf(a: number, b: number): number {
  if (b === 0) {
    return a;
  }

  return gcf(b, a % b);
}

function hasLineOfSight(map: boolean[][], x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const divisor = gcf(Math.abs(dx), Math.abs(dy));
  const stepx = dx / divisor;
  const stepy = dy / divisor;

  for (let i = 1; ; i++) {
    let cx = x1 + (stepx * i);
    let cy = y1 + (stepy * i);

    if (cx === x2 && cy === y2) {
      break;
    }

    if (map[cy][cx]) {
      // Hit another asteroid
      return false;
    }
  }

  return true;
}

function calculateVisibility(map: boolean[][], x: number, y: number) {
  if (!map[y][x]) {
    return 0;
  }

  let total = 0;

  for (let xx = 0; xx < map[0].length; xx++) {
    for (let yy = 0; yy < map.length; yy++) {
      if (xx === x && yy === y) {
        continue;
      }

      if (map[yy][xx] && hasLineOfSight(map, xx, yy, x, y)) {
        total++;
      }
    }
  }

  return total;
}

function findBestVisibility(map: boolean[][]) {
  let highest = 0;

  map.forEach((row, y) => row.forEach((_location, x) => {
    const visibility = calculateVisibility(map, x, y);
    if (visibility > highest) {
      highest = visibility;
    }
  }));

  return highest;
}

(async () => {
  const inputFile = await readInputFile(10);
  const map = loadMap(inputFile);

  console.log(chalk.bold.white("===== Day 10 ====="));

  // ===== Part 1 =====
  console.log(`${chalk.bold("Part 1:")} ${chalk.yellow(findBestVisibility(map))}`);

  // ===== Part 2 =====
  console.log(`${chalk.bold("Part 2:")} ${chalk.yellow("TODO")}`);
})();