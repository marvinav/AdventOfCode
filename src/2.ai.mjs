import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function possibleGames(cubeCounts, games) {
  const possibleGames = [];

  for (let i = 0; i < games.length; i++) {
    const subsets = games[i].split("; ").map((subset) => subset.split(", "));
    let isValid = true;

    for (let j = 0; j < subsets.length; j++) {
      const counts = subsets[j].reduce((acc, subset) => {
        const [count, color] = subset.split(" ");
        acc[color] = (acc[color] || 0) + parseInt(count);
        return acc;
      }, {});

      if (
        counts["red"] > cubeCounts["red"] ||
        counts["green"] > cubeCounts["green"] ||
        counts["blue"] > cubeCounts["blue"]
      ) {
        isValid = false;
        break;
      }
    }

    if (isValid) {
      possibleGames.push(i + 1); // Adding 1 to match game IDs starting from 1
    }
  }

  return possibleGames;
}

// Example input data
const cubeCounts = {
  red: 12,
  green: 13,
  blue: 14,
};

const games = [
  "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green",
  "Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue",
  "Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red",
  "Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red",
  "Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green",
];

const dayInput = fs
  .readFileSync(path.join(__dirname, "../input/2.txt"))
  .toString()
  .split("\n");

const possible = possibleGames(cubeCounts, dayInput);
const sumOfIDs = possible.reduce((acc, id) => acc + id, 0);

console.log("Games that would have been possible:", possible);
console.log("Sum of their IDs:", sumOfIDs);
