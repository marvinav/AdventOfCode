import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const cards = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

const test = /(?<cards>.{5}) (?<bid>\d{1,})/gim

const getCombination = (hand, part = 1) => {
  const result = new Map();

  [...hand].forEach(c => {
    result.set(c, (result.get(c) ?? 0) + 1);
  }) 

  const jocker = result.get('J');

  if(jocker && part === 2) {
    result.delete('J');
  }

  const val = [...result.values()].sort();
  

  if(val.length === 1) {
    return 'five-of-kind'
  }
  if(val.find(x=>x === 4)) {
    return 'four-of-kind'
  }
  if(val.find(x => x === 3)) {
    return val.find(x => x === 2) ? 'full-house' : 'three-of-kind';
  }
  if(val.find(x => x === 2)) {
    return val.filter(x => x === 2).length === 2 ? 'two-pair' : 'one-pair'
  }

  return 'high-card'
}

const convertToCardRank = (hand) => {
  return [...hand].map(x => cards.findIndex(c => c === x));
}

const combinationCost = {
  'five-of-kind': 12,
  'four-of-kind': 10,
  'full-house': 8,
  'three-of-kind': 6,
  'two-pair': 4,
  'one-pair': 2,
  'high-card': 0
}

const compareCards = (handOne, handTwo) => {
  const combOne = getCombination(handOne);
  const combTwo = getCombination(handTwo);

  const diff = combinationCost[combOne] - combinationCost[combTwo];

  if(diff !== 0) {
    return diff;
  }

  const ranksOne = convertToCardRank(handOne);
  const ranksTwo = convertToCardRank(handTwo);
  console.log({handOne,handTwo, ranksOne, ranksTwo});
  let diffInRanks = 0;
  let index = 0;

  while(diffInRanks === 0 && index < ranksOne.length) {
    diffInRanks = ranksOne[index] - ranksTwo[index];
    index++;
  }

  return diffInRanks;
}

/**
 * @param {string} puzzleData
 * @param {1|2} part
 */
const solvePuzzle = (puzzleData, part) => {
  const hands = [...puzzleData.matchAll(test)].map(({groups})=>({cards: groups.cards, bid: Number.parseInt(groups.bid)}));



  return hands.sort((a, b) => compareCards(a.cards, b.cards)).map((x,ind) => x.bid * (ind+1)).reduce((p, c) => p+c,0)
};

const firstTest = `
QQQJA 483
32T3K 765
T55J5 684
KK677 28
KTJJT 220
`;

console.log("First test:\t", solvePuzzle(firstTest, 1));
// console.log("Second test:\t", solvePuzzle(firstTest, 2));

const dayInput = fs
  .readFileSync(path.join(__dirname, "../input/7.txt"))
  .toString();

console.log("First part:\t", solvePuzzle(dayInput, 1));
// console.log("Second part:\t", solvePuzzle(dayInput, 2));
