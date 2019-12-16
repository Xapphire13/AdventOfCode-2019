import path from "path";
import { promisify } from "util";
import fs from "fs";

export default function readInputFile(day: number): Promise<string> {
  const questionDir = path.resolve(__dirname, `../../src/day${String(day).padStart(2, "0")}`);

  return promisify(fs.readFile)(path.join(questionDir, "input.txt"), "utf8");
}