import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @param {string} puzzleData
 * @param {1|2} part
 */
const solvePuzzle = (puzzleData, part) => {
  const map = puzzleData
    .split("\n")
    .filter((x) => x !== "")
    .map((r) => [...r]);

  let adjustedMap = [...map];

  let columnWithoutGalaxies = new Array(map[0].length)
    .fill()
    .map((x, ind) => ind);

  map.forEach((row) => {
    const withGalaxies = [];
    columnWithoutGalaxies.forEach((x) => {
      if (row[x] === "#") {
        withGalaxies.push(x);
      }
    });

    withGalaxies.forEach((x) => {
      const index = columnWithoutGalaxies.findIndex((c) => x === c);
      columnWithoutGalaxies = [
        ...columnWithoutGalaxies.slice(0, index),
        ...columnWithoutGalaxies.slice(index + 1),
      ];
    });
  });

  columnWithoutGalaxies.forEach((x, ind) => {
    columnWithoutGalaxies[ind] = columnWithoutGalaxies[ind] + ind;
  });

  adjustedMap.forEach((row, index) => {
    columnWithoutGalaxies.forEach((x) => {
      adjustedMap[index] = [
        ...adjustedMap[index].slice(0, x),
        ".",
        ...adjustedMap[index].slice(x),
      ];
    });
  });

  const rowWithoutGalaxies = adjustedMap.filter(
    (row) => row.filter((c) => c === "#").length === 0
  );
  const filling = new Array(rowWithoutGalaxies[0]?.length ?? 0)
    .fill()
    .map(() => ".");

  rowWithoutGalaxies.forEach((emptyRow) => {
    const index = adjustedMap.findIndex((row) => row === emptyRow);

    adjustedMap = [
      ...adjustedMap.slice(0, index),
      filling,
      ...adjustedMap.slice(index),
    ];
  });

  const galaxyLocations = [];

  adjustedMap.forEach((row, y) => {
    row.forEach((col, x) => {
      if (col === "#") {
        galaxyLocations.push({ x, y });
      }
    });
  });

  let path = 0;

  galaxyLocations.forEach((current, ind) => {
    for (let i = ind + 1; i < galaxyLocations.length; i++) {
      path =
        path +
        Math.abs(current.x - galaxyLocations[i].x) +
        Math.abs(current.y - galaxyLocations[i].y);
    }
  });
  return path;
  return `\n${adjustedMap.map((x) => x.join("")).join("\n")}`;
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

console.log("First test:\t", solvePuzzle(firstTest, 1));
// console.log("Second test:\t", solvePuzzle(secondTest, 2));

const dayInput = fs
  .readFileSync(path.join(__dirname, "../input/11.txt"))
  .toString();

console.log("First part:\t", solvePuzzle(dayInput, 1));
// console.log("Second part:\t", solvePuzzle(dayInput, 2));
