// https://adventofcode.com/2019/day/11
import chalk from "chalk";
import readInputFile from "../utils/readInputFile";
import Point from "../Point";
import ShipComputer from "../ShipComputer";

enum Color {
  Black = 0,
  White = 1
}

enum Direction {
  Left = 0,
  Right = 1,
  Up, Down
}

class SpaceMap {
  private locations = new Map<number, Map<number, Color>>();
  private minX = 0;
  private maxX = 0;
  private minY = 0;
  private maxY = 0;

  get(point: Point) {
    this.ensureSpaceExists(point);

    const { x, y } = point;

    return this.locations.get(x)!.get(y)!;
  }

  set(point: Point, color: Color) {
    this.ensureSpaceExists(point);

    const { x, y } = point;

    this.minX = Math.min(x, this.minX);
    this.maxX = Math.max(x, this.maxX);
    this.minY = Math.min(y, this.minY);
    this.maxY = Math.max(y, this.maxY);

    this.locations.get(x)!.set(y, color);
  }

  getAll() {
    return [...this.locations.entries()].reduce<([Point, Color])[]>((res, [x, yMap]) => res.concat([...yMap.entries()].map(([y, color]) => [{ x, y } as Point, color])), []);
  }

  toString(): string {
    const mapHeight = this.maxY - this.minY + 1;
    const mapWidth = this.maxX - this.minX + 1;

    return [...new Array(mapHeight).keys()]
      .map((y) => [...new Array(mapWidth).keys()]
        .map(x => this.get({ x, y }) === Color.Black ? chalk.black('█') : chalk.white('█'))
        .join(''))
      .join("\n");
  }

  private ensureSpaceExists({ x, y }: Point) {
    if (!this.locations.get(x)) {
      this.locations.set(x, new Map([[y, Color.Black]]));
    } else if (!this.locations.get(x)?.get(y)) {
      this.locations.get(x)?.set(y, Color.Black);
    }
  }
}

class BufferedOutput {
  private buffer: number[] = new Array(2);
  private index = 0;

  constructor(private handler: (bufferedOutput: [number, number]) => void) { }

  write = (value: number) => {
    this.buffer[this.index++] = value;

    if (this.index == 2) {
      const [arg1, arg2] = this.buffer;
      this.handler([arg1, arg2]);
      this.index = 0;
    }
  }
}

class Robot {
  position: Point = { x: 0, y: 0 };
  private direction = Direction.Up;

  constructor(
    private program: number[],
    private map: SpaceMap) { }

  async run() {
    const buffer = new BufferedOutput(this.handleOutput as any);
    await ShipComputer.executeProgram(this.program, { input: this.readInput, output: buffer.write });
  }

  private readInput = () => Promise.resolve(this.map.get(this.position));

  private handleOutput = ([color, direction]: [Color, Direction]) => {
    this.map.set(this.position, color);
    this.rotate(direction);
    this.moveForward();
  }

  private rotate(direction: Direction) {
    switch (this.direction) {
      case Direction.Up:
        this.direction = direction === Direction.Left ? Direction.Left : Direction.Right;
        break;
      case Direction.Right:
        this.direction = direction === Direction.Left ? Direction.Up : Direction.Down;
        break;
      case Direction.Down:
        this.direction = direction === Direction.Left ? Direction.Right : Direction.Left;
        break;
      case Direction.Left:
      default:
        this.direction = direction === Direction.Left ? Direction.Down : Direction.Up;
        break;
    }
  }

  private moveForward() {
    switch (this.direction) {
      case Direction.Up:
        this.position = { x: this.position.x, y: this.position.y - 1 };
        break;
      case Direction.Right:
        this.position = { x: this.position.x + 1, y: this.position.y };
        break;
      case Direction.Down:
        this.position = { x: this.position.x, y: this.position.y + 1 };
        break;
      case Direction.Left:
      default:
        this.position = { x: this.position.x - 1, y: this.position.y };
        break;
    }
  }
}

(async () => {
  console.log(chalk.bold.white("===== Day 11 ====="));
  const inputFile = await readInputFile(11);
  const program = ShipComputer.loadProgram(inputFile);

  // ===== Part 1 =====
  const map1 = new SpaceMap();
  const robot1 = new Robot(program.slice(), map1);
  await robot1.run();
  console.log(`${chalk.bold("Part 1:")} ${chalk.yellow(map1.getAll().length)}`);

  // ===== Part 2 =====
  const map2 = new SpaceMap();
  map2.set({ x: 0, y: 0 }, Color.White);
  const robot2 = new Robot(program.slice(), map2);
  await robot2.run();
  console.log(`${chalk.bold("Part 2:")}\n${chalk.yellow(map2.toString())}`);
})();