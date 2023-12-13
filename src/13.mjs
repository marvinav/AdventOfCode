import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const test = /(?<question>\?)|(?<dot>\.)/gim;

/**
 * @param {string[]} rows
 */
const findLeftSymmetry = (rows) => {
  const rowLength = rows[0].length;
  const rowCount = rows.length;

  for (let col = 1; col < rowLength; col++) {
    let isSimilar = true;
    for (let r = 0; r < rowCount; r++) {
      if (rows[r][0] != rows[r][col]) {
        isSimilar = false;
      }
    }
    if (isSimilar) {
      return col - 1;
    }
  }
  return -1;
};

/**
 * @param {string[]} rows
 */
const findRightSymmetry = (rows) => {
  const rowLength = rows[0].length;
  const rowCount = rows.length;
  const lastCol = rowLength - 1;

  for (let col = 0; col < rowLength - 1; col++) {
    let isSimilar = true;
    for (let r = 0; r < rowCount; r++) {
      if (rows[r][lastCol] != rows[r][col]) {
        isSimilar = false;
      }
    }
    if (isSimilar) {
      return rowLength - col;
    }
  }
  return -1;
};
/**
 * @param {string} puzzleData
 * @param {1|2} part
 */
const solvePuzzle = (puzzleData, coefficient) => {
  const map = puzzleData
    .split("\n\n")
    .filter((x) => x != "")
    .map((x) => x.split("\n").filter((x) => x != ""));

  let columnsAbove = 0;
  let rowsLeft = 0;
  map.forEach((pattern) => {
    const downReflection = [...pattern.slice(1)].findIndex(
      (x) => x === pattern[0]
    );

    if (downReflection > -1) {
      const halfLength = (downReflection + 2) / 2;
      columnsAbove = columnsAbove + halfLength;
      return;
    }

    const upReflection = [...pattern]
      .reverse()
      .slice(1)
      .findIndex((x) => x === pattern[pattern.length - 1]);

    if (upReflection > -1) {
      const halfLength = (upReflection + 2) / 2;
      columnsAbove = columnsAbove + pattern.length - halfLength;
      return;
    }

    const leftSymmetry = findLeftSymmetry(pattern);

    if (leftSymmetry > -1) {
      const halfLength = (leftSymmetry + 2) / 2;
      rowsLeft = rowsLeft + halfLength;
      return;
    }

    const rightSymmetry = findRightSymmetry(pattern);

    if (rightSymmetry > -1) {
      const halfLength = (rightSymmetry + 2) / 2;
      rowsLeft = rowsLeft + halfLength;
      return;
    }
  });
  return columnsAbove * 100 + rowsLeft;
};

const firstTest = `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#
`;

const secondTest = `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#
#...##..#
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
