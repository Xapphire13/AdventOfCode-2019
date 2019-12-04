// https://adventofcode.com/2019/day/3
import fs from "fs";
import path from "path";
import { promisify } from "util";
import getQuestionSrcDir from "../utils/getQuestionSrcDir";
import chalk from "chalk";

type Point = {
  x: number;
  y: number;
};

type WireSegment = [Point, Point];

const INPUT_PATH = path.resolve(getQuestionSrcDir(3), "input.txt");

async function readInput() {
  const lines = (await promisify(fs.readFile)(INPUT_PATH, "utf8")).trim().split(/\r?\n/);

  return lines.map(line => line.split(","));
}

function transform(point: Point, direction: string, distance: number): Point {
  const result: Point = { ...point };

  switch (direction) {
    case "U":
      result.y += distance;
      break;
    case "D":
      result.y -= distance;
      break;
    case "L":
      result.x -= distance;
      break;
    case "R":
      result.x += distance;
      break;
  }

  return result;
}

function getWireSegments(wire: string[]): WireSegment[] {
  let x = 0;
  let y = 0;

  return wire.map(segment => {
    const direction = segment.slice(0, 1);
    const distance = +segment.slice(1);

    const start: Point = { x, y };
    const end = transform(start, direction, distance);

    x = end.x;
    y = end.y;

    return [start, end];
  });
}

function isHorizontal([start, end]: WireSegment) {
  return start.y === end.y;
}

function isVertical([start, end]: WireSegment) {
  return start.x === end.x;
}

function getIntersection(segment1: WireSegment, segment2: WireSegment): Point | undefined {
  // If lines are parrallel, they dont intersect
  if ((isHorizontal(segment1) && isHorizontal(segment2)) ||
    (isVertical(segment1) && isVertical(segment2))) {
    return undefined;
  }

  const [hStart, hEnd] = isHorizontal(segment1) ? segment1 : segment2;
  const [vStart, vEnd] = isVertical(segment1) ? segment1 : segment2;
  const hMin = Math.min(hStart.x, hEnd.x);
  const hMax = Math.max(hStart.x, hEnd.x);
  const vMin = Math.min(vStart.y, vEnd.y);
  const vMax = Math.max(vStart.y, vEnd.y);

  if (vStart.x >= hMin && vStart.x <= hMax) {
    // Within horizontal footprint
    if (hStart.y >= vMin && hStart.y <= vMax) {
      // Within vertical footprint
      return { x: vStart.x, y: hStart.y };
    }
  }

  return undefined;
}

function calculateDistance(point1: Point, point2: Point) {
  return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
}

(async () => {
  console.log(chalk.bold.white("===== Day 3 ====="));
  const [wire1, wire2] = await readInput();

  // ===== Part 1 =====
  const wire1Segments = getWireSegments(wire1);
  const wire2Segments = getWireSegments(wire2);
  const intersections: Point[] = [];

  wire1Segments.forEach(wire1Segment => {
    wire2Segments.forEach(wire2Segment => {
      const intersection = getIntersection(wire1Segment, wire2Segment);

      if (intersection && !(intersection.x === 0 && intersection.y === 0)) {
        intersections.push(intersection);
      }
    })
  });

  let minDistance = Infinity;
  intersections.forEach(intersection => {
    const distance = calculateDistance({ x: 0, y: 0 }, intersection);

    if (distance < minDistance) {
      minDistance = distance;
    }
  });

  console.log(`${chalk.bold("Part 1:")} ${chalk.yellow(minDistance)}`);
})();