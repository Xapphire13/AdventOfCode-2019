import yargs from "yargs";
import path from "path";
import childProcess from "child_process";

const OUTPUT_DIR = path.resolve(__dirname, "../dist");

const args = yargs.usage(
  "$0 <questionDay>",
  "run a question's solution",
  y => y.positional("questionDay", {
    type: "string",
    description: "The question day to run"
  })).strict().parse();

childProcess.execSync(
  `./node_modules/.bin/ts-node -T ${path.join(OUTPUT_DIR, args.questionDay as string)}/index.js`, { stdio: "inherit" });