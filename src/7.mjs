import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const cards = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];

const jokerCards = [
  "J",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "Q",
  "K",
  "A",
];

const combinationCost = {
  "five-of-kind": 12,
  "four-of-kind": 10,
  "full-house": 8,
  "three-of-kind": 6,
  "two-pair": 4,
  "one-pair": 2,
  "high-card": 0,
};

const test = /(?<cards>.{5}) (?<bid>\d{1,})/gim;

const getCombination = (hand, part = 1) => {
  const result = new Map();

  [...hand].forEach((c) => {
    result.set(c, (result.get(c) ?? 0) + 1);
  });

  const joker = part === 2 ? result.get("J") : 0;

  if (joker > 0) {
    result.delete("J");
  }

  const val = [...result.values()].sort();

  if (val.length === 1) {
    return "five-of-kind";
  }
  if (val.find((x) => x === 4)) {
    return joker > 0 ? "five-of-kind" : "four-of-kind";
  }

  if (val.find((x) => x === 3)) {
    if (joker > 0) {
      return joker === 2 ? "five-of-kind" : "four-of-kind";
    }
    return val.find((x) => x === 2) ? "full-house" : "three-of-kind";
  }

  if (val.find((x) => x === 2)) {
    if (joker > 1) {
      return joker === 3 ? "five-of-kind" : "four-of-kind";
    }

    if (joker === 1) {
      return val.filter((x) => x === 2).length === 2
        ? "full-house"
        : "three-of-kind";
    }

    return val.filter((x) => x === 2).length === 2 ? "two-pair" : "one-pair";
  }

  if (joker > 2) {
    return joker === 3 ? "four-of-kind" : "five-of-kind";
  }

  if (joker > 0) {
    return joker === 1 ? "one-pair" : "three-of-kind";
  }

  return "high-card";
};

const convertToCardRank = (hand, c = cards) => {
  return [...hand].map((x) => c.findIndex((c) => c === x));
};

const compareCards = (handOne, handTwo, part) => {
  const combOne = getCombination(handOne, part);
  const combTwo = getCombination(handTwo, part);

  const diff = combinationCost[combOne] - combinationCost[combTwo];

  if (diff !== 0) {
    return diff;
  }

  const ranksOne = convertToCardRank(handOne, part === 2 ? jokerCards : cards);
  const ranksTwo = convertToCardRank(handTwo, part === 2 ? jokerCards : cards);
  let diffInRanks = 0;
  let index = 0;

  while (diffInRanks === 0 && index < ranksOne.length) {
    diffInRanks = ranksOne[index] - ranksTwo[index];
    index++;
  }

  return diffInRanks;
};

/**
 * @param {string} puzzleData
 * @param {1|2} part
 */
const solvePuzzle = (puzzleData, part) => {
  const hands = [...puzzleData.matchAll(test)].map(({ groups }) => ({
    cards: groups.cards,
    bid: Number.parseInt(groups.bid),
  }));

  return hands
    .sort((a, b) => compareCards(a.cards, b.cards, part))
    .map((x, ind) => x.bid * (ind + 1))
    .reduce((p, c) => p + c, 0);
  //  .map((x, ind) => ({ c: getCombination(x.cards, part), cards: x.cards }));
  //.reduce((p, c) => p + c, 0);
};

const firstTest = `
QQQJA 483
32T3K 765
T55J5 684
KK677 28
KTJJT 220
`;

const validationTest = `
JJJJJ 1
JJJJQ 1
JJJQQ 1
JJJQK 1
JJQQQ 1
JJQQK 1
JJQKJ 1
JQQQQ 1
JQQQK 1
JQQKK 1
JQQK8 1
JQK89 1
`;

console.log("Validation test:\t", solvePuzzle(validationTest, 2));

console.log("First test:\t", solvePuzzle(firstTest, 1));
console.log("Second test:\t", solvePuzzle(firstTest, 2));

const dayInput = fs
  .readFileSync(path.join(__dirname, "../input/7.txt"))
  .toString();

console.log("First part:\t", solvePuzzle(dayInput, 1));
console.log("Second part:\t", solvePuzzle(dayInput, 2));
