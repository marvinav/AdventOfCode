import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const test = /(?<question>\?)|(?<dot>\.)/gim;

const parseSpring = (spring) => {
  /**
   * @type {{questions: number[], dots: number[], damaged: number[]}}
   */
  const result = {
    questions: [],
    dots: [],
    damaged: [],
  };

  [...spring].forEach((x, ind) => {
    switch (x) {
      case ".":
        result.dots.push(ind);
        break;
      case "#":
        result.damaged.push(ind);
        break;
      case "?":
        result.questions.push(ind);
        break;
      default:
        throw new Error(`unknown symbol ${x}`);
    }
  });
  return {
    ...result,
    size: result.questions.length + result.damaged.length + result.dots.length,
  };
};
/**
 * @param {string} puzzleData
 * @param {1|2} part
 */
const solvePuzzle = (puzzleData, coefficient) => {
  const map = puzzleData
    .split("\n")
    .filter((x) => x !== "")
    .map((r) => r.split(" "))
    .map((x) => ({ spring: parseSpring(x[0]), sequence: x[1].split(",") }));

  map.forEach((x) => {
    x.spring.size;
  });
  return map;
};

const firstTest = `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`;

// 374
console.log("First test:\t", solvePuzzle(firstTest, 2));

// const dayInput = fs
//   .readFileSync(path.join(__dirname, "../input/11.txt"))
//   .toString();

// // 9536038
// console.log("First part:\t", solvePuzzle(dayInput, 2));
// // 447744640566
// console.log("Second part:\t", solvePuzzle(dayInput, 1_000_000));
