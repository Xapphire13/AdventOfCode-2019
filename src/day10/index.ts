// https://adventofcode.com/2019/day/10
import readInputFile from "../utils/readInputFile";
import chalk from "chalk";
import Point from "../Point";

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

function calculateVisibleAsteroids(map: boolean[][], { x, y }: Point): Point[] {
  if (!map[y][x]) {
    return [];
  }

  const asteroids: Point[] = [];

  for (let xx = 0; xx < map[0].length; xx++) {
    for (let yy = 0; yy < map.length; yy++) {
      if (xx === x && yy === y) {
        continue;
      }

      if (map[yy][xx] && hasLineOfSight(map, xx, yy, x, y)) {
        asteroids.push({ x: xx, y: yy });
      }
    }
  }

  return asteroids;
}

function findBestVisibility(map: boolean[][]): [number, Point] {
  let highest = 0;
  let position: Point = { x: 0, y: 0 };

  map.forEach((row, y) => row.forEach((_location, x) => {
    const visibility = calculateVisibleAsteroids(map, { x, y }).length;
    if (visibility > highest) {
      highest = visibility;
      position = { x, y };
    }
  }));

  return [highest, position];
}

function calculateAngle(origin: Point, position: Point): number {
  if (position.x >= origin.x && position.y < origin.y) { // In first quadrant
    const dx = position.x - origin.x;
    const dy = origin.y - position.y;
    const angle = Math.atan(dx / dy);

    return angle;
  } else if (position.x > origin.x && position.y >= origin.y) { // In second quadrant
    const dx = position.x - origin.x;
    const dy = position.y - origin.y;
    const angle = Math.atan(dy / dx);

    return angle + Math.PI / 2;
  } else if (position.x <= origin.x && position.y > origin.y) { // In third quadrant
    const dx = origin.x - position.x;
    const dy = position.y - origin.y;
    const angle = Math.atan(dx / dy);

    return angle + Math.PI;
  } else { // In fourth quadrant
    const dx = origin.x - position.x;
    const dy = origin.y - position.y;
    const angle = Math.atan(dy / dx);

    return angle + (3 * Math.PI) / 2;
  }
}

(async () => {
  const inputFile = await readInputFile(10);
  const map = loadMap(inputFile);

  console.log(chalk.bold.white("===== Day 10 ====="));

  // ===== Part 1 =====
  const [bestVisibility, bestLocation] = findBestVisibility(map);
  console.log(`${chalk.bold("Part 1:")} ${chalk.yellow(bestVisibility)}`);

  // ===== Part 2 =====
  const sortedVisibleAsteroids = calculateVisibleAsteroids(map, bestLocation)
    .map(asteroid => [asteroid, calculateAngle(bestLocation, asteroid)] as [Point, number])
    .sort(([_asteroid1, a], [_asteroid2, b]) => a - b)
    .map(([asteroid]) => asteroid);
  const asteroid200 = sortedVisibleAsteroids[199];
  const result2 = asteroid200.x * 100 + asteroid200.y;
  console.log(`${chalk.bold("Part 2:")} ${chalk.yellow(result2)}`);
})();