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
  const test = /^Card( ){1,}(?<cardId>((\d){1,})):(?<winning>( |\d){1,}) \|(?<catched>( |\d){1,})/gim;

  const matches = puzzleData.matchAll(test);
  /**
   * @type {{win: number, cardId: number}[]}
   */
  const asterisk = [];

  const scratchCards = [];

  let maxCardId = 0;
  
  [...matches].forEach((x, ind) => {
    const cardId = Number.parseInt(x.groups.cardId);
    maxCardId = cardId > maxCardId ? cardId : maxCardId;
    
    const winning = x.groups.winning.split(' ').map(x => Number.parseInt(x, 10)).filter(x => !Number.isNaN(x));
    const catched = x.groups.catched.split(' ').map(x => Number.parseInt(x, 10)).filter(x => !Number.isNaN(x))

    const win = catched.filter(c => winning.includes(c)).length;

    // add original card
    scratchCards[cardId - 1] = (scratchCards[cardId - 1] ?? 0) + 1;

    for (let i = cardId; i < win + cardId; i++) {
      if (scratchCards[i]) {
        scratchCards[i] = scratchCards[i] + 1 * scratchCards[cardId - 1];
      } else {
        scratchCards[i] = 1  * scratchCards[cardId - 1]
      }
    }

    asterisk.push({ cardId, winning, catched, win: win < 2 ? win : 2 ** (win - 1) });
  });

  if (part === 1) {
    return asterisk.map(x => x.win).reduce((p, c) => p + c, 0);
  }

  if (part === 2) {
    return scratchCards.slice(0, maxCardId).reduce((p, c) => p + c, 0);

  }
};

const firstTest = `
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`;

console.log("First test:\t", solvePuzzle(firstTest, 1));
console.log("Second test:\t", solvePuzzle(firstTest, 2));

const dayInput = fs
  .readFileSync(path.join(__dirname, "../input/4.txt"))
  .toString();

console.log("First part:\t", solvePuzzle(dayInput, 1));
console.log("Second part:\t", solvePuzzle(dayInput, 2));
