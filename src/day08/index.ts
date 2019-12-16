// https://adventofcode.com/2019/day/8
import readInputFile from "../utils/readInputFile";
import chalk from "chalk";

async function readInput(): Promise<number[]> {
  const text = await readInputFile(8);

  return [...text.trim()].map(char => +char);
}

interface Picture {
  readonly width: number;
  readonly height: number;
  readonly layers: number[][];
}

enum Color {
  Black = 0,
  White = 1,
  Transparent = 2
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
  function flattenImage(picture: Picture) {
    const flattened: number[] = [];
    const pixelsPerLayer = picture.width * picture.height;

    for (let i = 0; i < pixelsPerLayer; i++) {
      flattened.push(picture.layers.reduce((res, layer) => {
        if (res === Color.Transparent) {
          return layer[i];
        }

        return res;
      }, Color.Transparent));
    }

    return flattened;
  }
  function layerToString(layer: number[], width: number, height: number) {
    let lines = [];
    const pixels = width * height;
    for (let i = 0; i < pixels; i += width) {
      lines.push(layer.slice(i, i + width).join(""));
    }

    return lines.join("\n");
  }
  const flatImage = flattenImage(picture);
  let output = layerToString(flatImage, picture.width, picture.height);
  output = output.replace(/0/g, chalk.black("█"));
  output = output.replace(/1/g, chalk.white("█"));
  console.log(`${chalk.bold("Part 2:")}\n${chalk.yellow(output)}`);
})();