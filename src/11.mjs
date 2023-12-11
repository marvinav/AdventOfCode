import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getShift = (array, val) => {
  return [...array, val].sort((a, b) => a - b).findIndex((x) => x === val);
};

const findAdjustment = (shiftDiff, coefficient) =>
  coefficient * Math.abs(shiftDiff) - Math.abs(shiftDiff);

/**
 * @param {string} puzzleData
 * @param {1|2} part
 */
const solvePuzzle = (puzzleData, coefficient) => {
  const map = puzzleData
    .split("\n")
    .filter((x) => x !== "")
    .map((r) => [...r]);

  let emptyColumns = new Array(map[0].length).fill().map((x, ind) => ind);
  const emptyRows = [];

  map.forEach((row, index) => {
    const withGalaxies = [];
    emptyColumns.forEach((x) => {
      if (row[x] === "#") {
        withGalaxies.push(x);
      }
    });

    if (row.filter((c) => c === "#").length === 0) {
      emptyRows.push(index);
    }

    withGalaxies.forEach((x) => {
      const index = emptyColumns.findIndex((c) => x === c);
      emptyColumns = [
        ...emptyColumns.slice(0, index),
        ...emptyColumns.slice(index + 1),
      ];
    });
  });

  /**
   * @type {{x: number, y: number}[]}
   */
  const galaxyLocations = [];
  map.forEach((row, y) => {
    row.forEach((col, x) => {
      if (col === "#") {
        galaxyLocations.push({ x, y });
      }
    });
  });

  let path = 0;
  galaxyLocations.forEach((current, ind) => {
    const rowShift = getShift(emptyRows, current.y);
    const colShift = getShift(emptyColumns, current.x);
    for (let i = ind + 1; i < galaxyLocations.length; i++) {
      const nextRowShift = getShift(emptyRows, galaxyLocations[i].y);
      const nextColShift = getShift(emptyColumns, galaxyLocations[i].x);

      path =
        path +
        Math.abs(current.x - galaxyLocations[i].x) +
        Math.abs(current.y - galaxyLocations[i].y) +
        findAdjustment(rowShift - nextRowShift, coefficient) +
        findAdjustment(colShift - nextColShift, coefficient);
    }
  });

  return path;
};

const firstTest = `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`;

// 374
console.log("First test:\t", solvePuzzle(firstTest, 2));
// 1030
console.log("Second test:\t", solvePuzzle(firstTest, 10));
// 8410
console.log("Third test:\t", solvePuzzle(firstTest, 100));

const dayInput = fs
  .readFileSync(path.join(__dirname, "../input/11.txt"))
  .toString();

// 9536038
console.log("First part:\t", solvePuzzle(dayInput, 2));
// 447744640566
console.log("Second part:\t", solvePuzzle(dayInput, 1_000_000));
