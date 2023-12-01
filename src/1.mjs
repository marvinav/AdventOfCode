import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const digits = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
];

/**
 * @param {string} puzzleData
 * @param {1|2} part
 */
const solvePuzzle = (puzzleData, part) => {
  const splitted = puzzleData.split("\n").filter(Boolean);

  const numbers = splitted.map((s) => {
    const result = digits
      .map((name, ind) => ({
        value: ind + 1,
        matches: [
          ...s.matchAll(
            new RegExp(part === 2 ? `${name}|${ind + 1}` : `${ind + 1}`, "g")
          ),
        ],
      }))
      .flatMap(({ value, matches }) =>
        matches.map(({ index }) => ({ value, index }))
      )
      .sort((a, b) => a.index - b.index)
      .map((x) => x.value);

    return Number.parseInt(`${result[0]}${result[result.length - 1]}`, 10);
  });
  return numbers.filter((x) => !Number.isNaN(x)).reduce((p, c) => p + c);
};

const firstTest = `
  1abc2
  pqr3stu8vwx
  a1b2c3d4e5f
  treb7uchet
`;

const secondTest = `
  two1nine
  eightwothree
  abcone2threexyz
  xtwone3four
  4nineeightseven2
  zoneight234
  7pqrstsixteen
`;

console.log("First test:\t", solvePuzzle(firstTest, 1));
console.log("Second test:\t", solvePuzzle(secondTest, 2));

const dayInput = fs
  .readFileSync(path.join(__dirname, "../input/1.txt"))
  .toString();

console.log("First part:\t", solvePuzzle(dayInput, 1));
console.log("Second part:\t", solvePuzzle(dayInput, 2));
