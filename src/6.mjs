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
  const splitted = puzzleData.split("\n").filter((x) => x !== "");

  const [time, distance] = splitted.map((s) => {
    if (part === 1) {
      return s
        .split(" ")
        .map((x) => Number.parseInt(x))
        .filter((x) => !Number.isNaN(x));
    }

    return [
      Number.parseInt(
        s
          .split(" ")
          .map((x) => Number.parseInt(x))
          .filter((x) => !Number.isNaN(x))
          .join(""),
        10
      ),
    ];
  });

  const result = time.map((t, ind) => {
    const d = distance[ind] + 1;

    /**
     * d = V * t;
     * d = a * t1 * (t - t1)
     * d = t1 * (t - t1)
     * d = t1 * t - t1 * t1
     * d = t1 * 7 - t1 * t1
     * t1 * t - t1 * t1 - d = 0 / * -1
     * d - t1 * t + t1 * t1 = 0
     * t1 = (t +- root(t ** 2 - 4 * d)) / 2
     */
    const min = Math.ceil((t - Math.sqrt(t ** 2 - 4 * d)) / 2);
    const max = Math.floor((t + Math.sqrt(t ** 2 - 4 * d)) / 2);

    return max - min + 1;
  });
  return result.reduce((p, c) => p * c, 1);
};

const firstTest = `
Time:      7  15   30
Distance:  9  40  200
`;

console.log("First test:\t", solvePuzzle(firstTest, 1));
console.log("Second test:\t", solvePuzzle(firstTest, 2));

const dayInput = `
Time:        46     68     98     66
Distance:   358   1054   1807   1080
`;

console.log("First part:\t", solvePuzzle(dayInput, 1));
console.log("Second part:\t", solvePuzzle(dayInput, 2));
