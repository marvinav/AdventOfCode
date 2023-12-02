import { group } from "console";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const limitation = {
  red: 12,
  green: 13,
  blue: 14,
};

/**
 * @param {string} puzzleData
 * @param {1|2} part
 */
const solvePuzzle = (puzzleData, part) => {
  const splitted = puzzleData.split("\n").filter(Boolean);
  const test =
    /(Game (?<game>\d{1,}):)|(((?<n>\d{1,}) (?<c>(blue)|(green)|(red))))|(?<set>;)/gi;

  const numbers = splitted.map((s) => {
    const matches = [...s.matchAll(test)];
    const gameId = Number.parseInt(
      matches.find((m) => m.groups["game"]).groups["game"]
    );

    const setsIndexes = matches
      .filter((m) => m.groups["set"])
      .map((x) => x.index)
      .sort((a, b) => a - b);

    const minimum = {
      green: 0,
      blue: 0,
      red: 0,
    };

    const balls = new Array(setsIndexes.length + 1).fill().map(() => ({
      blue: 0,
      green: 0,
      red: 0,
    }));

    matches
      .filter((m) => m.groups["c"])
      .sort((a, b) => a.index - b.index)
      .forEach((m) => {
        let groupId = setsIndexes.findIndex((s) => s > m.index);
        groupId = groupId === -1 ? setsIndexes.length : groupId;
        const { n, c } = m.groups;
        balls[groupId][c] = balls[groupId][c] + Number.parseInt(n);

        if (minimum[c] < balls[groupId][c]) {
          minimum[c] = balls[groupId][c];
        }
      });

    return {
      minimum,
      gameId,
      ...balls,
      impossible:
        minimum.green > limitation.green ||
        minimum.red > limitation.red ||
        minimum.blue > limitation.blue,
    };
  });

  if (part === 1) {
    return numbers
      .filter((x) => !x.impossible)
      .map((p) => p.gameId)
      .reduce((p, c) => c + p, 0);
  }

  return numbers
    .map((x) => x.minimum.blue * x.minimum.green * x.minimum.red)
    .reduce((p, c) => p + c, 0);
};

const firstTest = `
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`;

console.log("First test:\t", solvePuzzle(firstTest, 1));
console.log("Second test:\t", solvePuzzle(firstTest, 2));

const dayInput = fs
  .readFileSync(path.join(__dirname, "../input/2.txt"))
  .toString();

console.log("First part:\t", solvePuzzle(dayInput, 1));
console.log("Second part:\t", solvePuzzle(dayInput, 2));
