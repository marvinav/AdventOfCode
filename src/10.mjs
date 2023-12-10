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
};

const directions = [
  [-1, 0],
  [1, 0],
  [0, 1],
  [0, -1],
];

//451, 295

const startDirectionsToPipes = (directions) => {
  if (directions.length != 2) {
    throw new Error("Incorrect directions");
  }

  const [first, second] = directions;

  const firstX = first[0] * -1;
  const firstY = first[1] * 2;
  const secondX = second[0] * -1;
  const secondY = second[1] * 2;

  const dir = [firstX, firstY, secondX, secondY].filter((x) => x !== 0);

  pipes["S"] = dir;
};

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
    if (
      startRow + v[0] < 0 ||
      startRow + v[0] > map.length ||
      startCol + v[1] < 0 ||
      startCol + v[1] > map[0].length
    ) {
      return;
    }
    const neighborhood = map[startRow + v[0]][startCol + v[1]];
    const neighborhoodConnection = pipes[neighborhood];

    const startConnection = v[0] === 0 ? v[1] * 2 : v[0] * -1;
    const isConnected =
      neighborhoodConnection[0] + startConnection === 0 ||
      neighborhoodConnection[1] + startConnection === 0;

    return isConnected;
  });

  startDirectionsToPipes(startDirections);
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
  const sortedLoop = loopCoordinates.map((x) => [...x].sort());

  if (part === 1) {
    return stepCounter / 2;
  }

  const checkConnectionWithPrevious = (rowIndex, colIndex) => {
    if (colIndex === 0) {
      return false;
    }

    const cell = map[rowIndex][colIndex];
    const cellConnections = pipes[cell];

    if (cellConnections.find((x) => x === -2)) {
      const leftCell = map[rowIndex][colIndex - 1];
      const leftCellConnections = pipes[leftCell];
      return Boolean(leftCellConnections.find((x) => x === 2));
    }

    return false;
  };

  let insideLoopCounter = 0;

  const insideLoopCoordinates = new Array(map.length).fill(null).map(() => []);

  map.forEach((row, rowIndex) => {
    let isInside = false;

    row.forEach((c, colIndex) => {
      const isMainLoop =
        sortedLoop[rowIndex].findIndex((x) => x === colIndex) > -1;

      if (isMainLoop) {
        const isConnected = checkConnectionWithPrevious(rowIndex, colIndex);
        isInside = isConnected ? false : !isInside;
      }

      if (isInside && !isMainLoop) {
        insideLoopCoordinates[rowIndex].push(colIndex);
        insideLoopCounter++;
      }
    });
  });

  map.forEach((row, rowIndex) => {
    let rowFormatted = "";
    row.forEach((c, colIndex) => {
      if (sortedLoop[rowIndex].findIndex((x) => x === colIndex) > -1) {
        rowFormatted = rowFormatted + "\x1b[41m" + c + "\x1b[0m";
        return;
      }
      if (
        insideLoopCoordinates[rowIndex].findIndex((x) => x === colIndex) > -1
      ) {
        rowFormatted = rowFormatted + "\x1b[33m" + c + "\x1b[0m";
        return;
      }
      rowFormatted = rowFormatted + c;
    });

    console.log(rowFormatted);
  });

  return insideLoopCounter;
};

const firstTest = `
-L||-F7
7S---7|
L|.d.||
-L---J|
L|--|JF
`;

const secondTest = `
FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L
`;

console.log("First test:\t", solvePuzzle(firstTest, 1));
// console.log("Second test:\t", solvePuzzle(secondTest, 2));

const dayInput = fs
  .readFileSync(path.join(__dirname, "../input/10.txt"))
  .toString();

console.log("First part:\t", solvePuzzle(dayInput, 1));
// console.log("Second part:\t", solvePuzzle(dayInput, 2));
