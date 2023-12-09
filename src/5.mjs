import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const paths = [
  "humidity",
  "temperature",
  "light",
  "water",
  "fertilizer",
  "soil",
];

const getPrevNode = (mapNode, destIndex) => {
  const node = mapNode.find((mn) => {
    return mn.destStart <= destIndex && mn.destStart + mn.count > destIndex;
  }) ?? {
    srcStart: destIndex,
    destStart: destIndex,
    count: 0,
  };

  const diff = destIndex - node.destStart;

  return diff + node.srcStart;
};

/**
 * @param {string} puzzleData
 * @param {1|2} part
 */
const solvePuzzle = (puzzleData, part) => {
  const test =
    /(?<seeds>seeds:(?<target>(\d| |\n){1,}))|((?<src>^\w{1,})-to-(?<dest>\w{1,}) map:(?<rules>(\d| |\n){1,}))/gim;

  const matches = puzzleData.matchAll(test);

  const map = {};

  const direction = [];
  [...matches].forEach((x) => {
    const { seeds, dest, rules, target } = x.groups;

    if (seeds && target) {
      const parsedSeeds = target
        .split(/ |\n/gim)
        .filter((x) => x != "")
        .map((x) => Number.parseInt(x, 10));

      if (part === 1) {
        map.seed = parsedSeeds.map((x) => ({ start: x, end: x }));
      }

      if (part === 2) {
        const rangedSeed = [];

        for (let i = 0; i < parsedSeeds.length; i = i + 2) {
          const start = parsedSeeds[i];
          const end = start + parsedSeeds[i + 1] - 1;
          rangedSeed.push({ start, end });
        }

        map.seed = rangedSeed;
      }

      return;
    }

    direction.push(dest);

    const ruleSplitted = rules.split("\n").filter((x) => x != "");
    /**
     * @type {{srcStart: number, destStart: number, count: number}[]}
     */
    let ruleRowed = ruleSplitted
      .map((x) => {
        return x.split(" ").map((s) => Number.parseInt(s, 10));
      })
      .map(([destStart, srcStart, count]) => ({ srcStart, destStart, count }))
      .sort((a, b) => a.srcStart - b.srcStart);

    if (ruleRowed[0].srcStart > 0) {
      ruleRowed = [
        { srcStart: 0, destStart: 0, count: ruleRowed[0].srcStart },
        ...ruleRowed,
      ];
    }

    map[dest] = ruleRowed;
  });

  let min = Number.MAX_VALUE;

  for (let location = 0; location < Number.MAX_VALUE; location++) {
    let startPath = getPrevNode(map.location, location);
    paths.forEach((x) => {
      startPath = getPrevNode(map[x], startPath);
    });

    if (map.seed.find((x) => startPath >= x.start && x.end >= startPath)) {
      min = location;
      break;
    }
  }
  return min;
};

const firstTest = `
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`;

console.log("First test:\t", solvePuzzle(firstTest, 1));
console.log("Second test:\t", solvePuzzle(firstTest, 2));

const dayInput = fs
  .readFileSync(path.join(__dirname, "../input/5.txt"))
  .toString();

console.log("First part:\t", solvePuzzle(dayInput, 1));
console.log("Second part:\t", solvePuzzle(dayInput, 2));
