import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const test = /^(?<node>.{3}) = \((?<L>.{3}), (?<R>.{3})\)/gim;

/**
 * @param {string} puzzleData
 * @param {1|2} part
 */
const solvePuzzle = (puzzleData, part) => {
  const instruction = puzzleData.split("\n").filter((x) => x !== "")[0];
  const path = new Map();

  let currentNodes = [];

  [...puzzleData.matchAll(test)].forEach(({ groups }) => {
    if (groups.node[2] === "A") {
      currentNodes.push(groups.node);
    }
    path.set(groups.node, { ...groups });
  });

  const getIndex = (step) => step % instruction.length;

  currentNodes = part === 1 ? ["AAA"] : currentNodes;

  let steps = new Array(currentNodes.length).fill(0);

  currentNodes.forEach((x, ind) => {
    while (
      part === 1 ? currentNodes[ind] !== "ZZZ" : currentNodes[ind][2] != "Z"
    ) {
      const direction = instruction[getIndex(steps[ind])];

      currentNodes[ind] = path.get(currentNodes[ind])[direction];

      steps[ind] = steps[ind] + 1;
    }
  });

  steps.sort((a, b) => b - a);

  while (steps.length > 1) {
    let max = steps[0];
    let multiplicator = 1;
    let numberOfSteps = multiplicator * max;
    const toCheck = steps.splice(0, 2);

    while (toCheck.find((x) => numberOfSteps % x !== 0)) {
      numberOfSteps = max * multiplicator;
      multiplicator++;
    }
    steps = [numberOfSteps, ...steps];
  }

  return steps[0];
};

const firstTest = `
LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)
`;

const secondTest = `
LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
`;

console.log("First test:\t", solvePuzzle(firstTest, 1));
console.log("Second test:\t", solvePuzzle(secondTest, 2));

const dayInput = fs
  .readFileSync(path.join(__dirname, "../input/8.txt"))
  .toString();

console.log("First part:\t", solvePuzzle(dayInput, 1));
console.log("Second part:\t", solvePuzzle(dayInput, 2));
