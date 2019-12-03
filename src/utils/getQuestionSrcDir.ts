import path from "path";

export default function getQuestionSrcDir(day: number) {
  return path.resolve(__dirname, `../../src/day${day}`);
}