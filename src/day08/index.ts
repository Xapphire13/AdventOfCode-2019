// https://adventofcode.com/2019/day/8
import fs from "fs";
import path from "path";
import { promisify } from "util";
import getQuestionSrcDir from "../utils/getQuestionSrcDir";
import chalk from "chalk";

const INPUT_PATH = path.join(getQuestionSrcDir(8), "input.txt");

async function readInput(): Promise<number[]> {
  const text = await promisify(fs.readFile)(INPUT_PATH, "utf8");

  return [...text.trim()].map(char => +char);
}

interface Picture {
  readonly width: number;
  readonly height: number;
  readonly layers: number[][];
}

function deserializePicture(pixels: number[], width: number, height: number) {
  const layers: number[][] = [];

  const pixelsPerLayer = width * height;

  for (let i = 0; i < pixels.length; i += pixelsPerLayer) {
    layers.push(pixels.slice(i, i + pixelsPerLayer));
  }

  return {
    height,
    width,
    layers
  } as Picture;
}

(async () => {
  console.log(chalk.bold.white("===== Day 8 ====="));
  const pictureInput = await readInput();
  const picture = deserializePicture(pictureInput, 25, 6);

  function countDigits(layer: number[], digit: number) {
    return layer.reduce((agg, curr) => curr === digit ? agg + 1 : agg, 0);
  }

  // ===== Part 1 =====
  function findLayerWithFewestZeros(picture: Picture) {
    let layerIndex = 0;
    let numberOfZeros = Infinity;

    picture.layers.forEach((layer, i) => {
      const result = countDigits(layer, 0);

      if (result < numberOfZeros) {
        layerIndex = i;
        numberOfZeros = result;
      }
    });

    return layerIndex;
  }
  const layerIndex = findLayerWithFewestZeros(picture);
  const answer1 = countDigits(picture.layers[layerIndex], 1) * countDigits(picture.layers[layerIndex], 2);

  console.log(`${chalk.bold("Part 1:")} ${chalk.yellow(answer1)}`);

  // ===== Part 2 =====
  console.log(`${chalk.bold("Part 2:")} ${chalk.yellow("TODO")}`);
})();