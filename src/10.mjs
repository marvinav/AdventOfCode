import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pipes = {
  "|": [1, -1], // 0 2
  "-": [2, -2], // 0 4
  L: [1, 2], // 3 3
  J: [1, -2], // -1 3
  7: [-1, -2], // -3 3
  F: [-1, 2], // 1 3
  ".": [0, 0],
  S: [1, -1],
};

const directions = [
  [-1, 0],
  [1, 0],
  [0, 1],
  [0, -1],
];

//451, 295

/**
 * @param {string} puzzleData
 * @param {1|2} part
 */
const solvePuzzle = (puzzleData, part) => {
  const map = puzzleData
    .split("\n")
    .filter((x) => x !== "")
    .map((r) => [...r]);
  const startRow = map.findIndex((r) => r.findIndex((c) => c === "S") > -1);
  const startCol = map[startRow].findIndex((c) => c === "S");

  const loopCoordinates = new Array(map.length).fill(null).map(() => new Set());

  loopCoordinates[startRow].add(startCol);

  const startDirections = directions.filter((v) => {
    const neighborhood = map[startRow + v[0]][startCol + v[1]];
    const neighborhoodConnection = pipes[neighborhood];
    const startConnection = v[0] === 0 ? v[1] * -2 : v[0] * -1;
    return (
      neighborhoodConnection[0] + startConnection === 0 ||
      neighborhoodConnection[1] + startConnection === 1
    );
  });

  let stepCounter = 1;
  let previousLocation = [startRow, startCol];
  let currentLocation = [
    startRow + startDirections[0][0],
    startCol + startDirections[0][1],
  ];
  loopCoordinates[currentLocation[0]].add(currentLocation[1]);

  const getNextCell = () => {
    const pipeConnections = pipes[map[currentLocation[0]][currentLocation[1]]];
    const mappedPipes = pipeConnections.map((d) => {
      if (Math.abs(d) === 1) {
        return [currentLocation[0] - d, currentLocation[1]];
      }

      return [currentLocation[0], currentLocation[1] + d / 2];
    });

    return mappedPipes.filter(
      (z) => z[0] !== previousLocation[0] || z[1] !== previousLocation[1]
    )[0];
  };

  while (currentLocation[0] != startRow || currentLocation[1] != startCol) {
    const nextCell = getNextCell();
    loopCoordinates[nextCell[0]].add(nextCell[1]);
    previousLocation = currentLocation;
    currentLocation = nextCell;
    stepCounter++;
  }
  if (part === 1) {
    return stepCounter / 2;
  }

  const sortedLoop = loopCoordinates.map((x) => [...x].sort());

  const checkConnectionWithPrevious = (rowIndex, colIndex) => {
    if (colIndex === 0) {
      return false;
    }
    const cell = map[rowIndex][colIndex - 1];
    const cellConnections = pipes[cell];

    return cellConnections.find((x) => x === 2);
  };

  let insideLoopCounter = 0;
  map.forEach((row, rowIndex) => {
    let isInside = false;
    let previousMainLoop = null;

    row.forEach((c, colIndex) => {
      const isMainLoop =
        sortedLoop[rowIndex].findIndex((x) => x === colIndex) > -1;

      const isConnected = checkConnectionWithPrevious(rowIndex, colIndex);

      if (!isConnected && isMainLoop) {
        isInside = !isInside;
      }

      if (isInside && !isMainLoop) {
        insideLoopCounter++;
      }
    });
  });
  return insideLoopCounter;
};

const firstTest = `
-L||F7
7S--7|
L|..||
-L--J|
L|-|JF
`;

const secondTest = `
...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........
`;

console.log("First test:\t", solvePuzzle(firstTest, 1));
// console.log("Second test:\t", solvePuzzle(secondTest, 1));

const dayInput = fs
  .readFileSync(path.join(__dirname, "../input/10.txt"))
  .toString();

console.log("First part:\t", solvePuzzle(dayInput, 1));
// console.log("Second part:\t", solvePuzzle(dayInput, 2));
