// https://adventofcode.com/2019/day/12
import chalk from "chalk";
import readInputFile from "../utils/readInputFile";

type Vector3 = [number, number, number];

class Moon {
  private velocity: Vector3 = [0, 0, 0];

  constructor(private position: Vector3) { }

  applyGravityFromMoon(moon: Moon) {
    const [x, y, z] = this.position;
    const [otherX, otherY, otherZ] = moon.position;

    if (otherX > x) {
      this.velocity[0]++;
    } else if (otherX < x) {
      this.velocity[0]--
    }

    if (otherY > y) {
      this.velocity[1]++;
    } else if (otherY < y) {
      this.velocity[1]--
    }

    if (otherZ > z) {
      this.velocity[2]++;
    } else if (otherZ < z) {
      this.velocity[2]--
    }
  }

  applyVelocity() {
    const [x, y, z] = this.velocity;

    this.position[0] += x;
    this.position[1] += y;
    this.position[2] += z;
  }

  get potentialEnergy() {
    const [x, y, z] = this.position;

    return Math.abs(x) + Math.abs(y) + Math.abs(z);
  }

  get kineticEnergy() {
    const [x, y, z] = this.velocity;

    return Math.abs(x) + Math.abs(y) + Math.abs(z);
  }

  get totalEnergy() {
    return this.potentialEnergy * this.kineticEnergy;
  }
}

function parseInputFile(file: string) {
  const lines = file.trim().split(/\r?\n/);

  return lines.map(line => {
    // Lines look like: <x=-8, y=-10, z=0>
    const [_, x, y, z] = /<x=([^,]+), y=([^,]+), z=([^,]+)>/.exec(line);

    return new Moon([+x, +y, +z]);
  });
}

function simulate(moons: Moon[], steps: number) {
  for (let step = 0; step < steps; step++) {
    for (let i = 0; i < moons.length; i++) {
      const moon1 = moons[i];

      for (let j = 0; j < moons.length; j++) {
        if (i === j) {
          continue;
        }

        const moon2 = moons[j];

        moon1.applyGravityFromMoon(moon2);
      }
    }

    moons.forEach(moon => moon.applyVelocity());
  }
}

(async () => {
  console.log(chalk.bold.white("===== Day 12 ====="));
  const inputFile = await readInputFile(12);

  // ===== Part 1 =====
  const moons = parseInputFile(inputFile);
  simulate(moons, 1000);
  const totalEnergy = moons.reduce((res, moon) => res + moon.totalEnergy, 0);
  console.log(`${chalk.bold("Part 1:")} ${chalk.yellow(totalEnergy)}`);

  // ===== Part 2 =====
  console.log(`${chalk.bold("Part 2:")} ${chalk.yellow("TODO")}`);
})();