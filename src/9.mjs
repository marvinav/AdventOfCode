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
  const histories = puzzleData
    .split("\n")
    .filter((x) => x !== "")
    .map((x) => [
      x
        .split(" ")
        .map((y) => Number.parseInt(y))
        .filter((n) => !Number.isNaN(n)),
    ]);

  const leftPlaceholders = []; // for part two
  const rightPlaceholders = []; // for part one

  histories.forEach((h) => {
    while (h[h.length - 1].find((x) => x !== 0)) {
      const current = h[h.length - 1];
      const newSequence = [];
      for (let i = 0; i < current.length - 1; i++) {
        newSequence.push(current[i + 1] - current[i]);
      }
      h.push(newSequence);
    }

    const leftHistoryPlaceholders = [0];
    const rightHistoryPlaceholders = [0];

    const reversed = [...h].reverse();
    for (let i = 0; i < reversed.length - 1; i++) {
      const upLine = reversed[i + 1];
      // part two
      const bottomLeft = leftHistoryPlaceholders[i];
      leftHistoryPlaceholders.push(upLine[0] - bottomLeft);
      // part one
      const bottomRight = rightHistoryPlaceholders[i];
      rightHistoryPlaceholders.push(upLine[upLine.length - 1] + bottomRight);
    }

    leftPlaceholders.push(leftHistoryPlaceholders);
    rightPlaceholders.push(rightHistoryPlaceholders);
  });

  return (part === 1 ? rightPlaceholders : leftPlaceholders)
    .map((x) => x[x.length - 1])
    .reduce((p, c) => p + c, 0);
};

const firstTest = `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`;

const secondTest = `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`;

console.log("First test:\t", solvePuzzle(firstTest, 1));
console.log("Second test:\t", solvePuzzle(secondTest, 2));

const dayInput = fs
  .readFileSync(path.join(__dirname, "../input/9.txt"))
  .toString();

console.log("First part:\t", solvePuzzle(dayInput, 1));
console.log("Second part:\t", solvePuzzle(dayInput, 2));
