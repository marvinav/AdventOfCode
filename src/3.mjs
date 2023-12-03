import { group } from "console";
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
  const splitted = puzzleData.split("\n").filter(Boolean);
  const rowsNumber = splitted.length;
  const colNumber = splitted[0].length;
  const length = rowsNumber * colNumber;

  const test =
    part === 1
      ? /(?<digit>\d{1,})|(?<del>[^\.\d{1,}])/gim
      : /(?<digit>\d{1,})|(?<del>[\*])/gim;

  const matches = puzzleData.replaceAll("\n", "").matchAll(test);
  /**
   * @type {{startIndex: number, endIndex: number, digit: number}[]}
   */
  const digits = [];
  const symbols = [];
  /**
   * @type {number[][]}
   */
  const asterisk = [];

  [...matches].forEach((x) => {
    const startIndex = x.index;
    const { digit, del } = x.groups;

    const endIndex =
      digit?.length > 0 ? startIndex + digit.length - 1 : startIndex;

    if (digit?.length > 0) {
      digits.push({ startIndex, endIndex, digit: Number.parseInt(digit, 10) });
      return;
    }

    if (del) {
      //move top
      const top = startIndex - colNumber;
      const isTopNotEdge = top >= 0;

      const left = startIndex - 1;
      const isLeftNotEdge = left % rowsNumber != 0 && left >= 0;

      const right = startIndex + 1;
      const isRightNotEdge = startIndex % rowsNumber != 0 && right <= length;

      const bottom = startIndex + colNumber;
      const isBottomNotEdge = bottom <= length;

      const topLeft = top - 1;
      const isTopLeftNotEdge = isTopNotEdge && isLeftNotEdge;

      const topRight = top + 1;
      const isTopRightNotEdge = isTopNotEdge && isRightNotEdge;

      const bottomLeft = bottom - 1;
      const isBottomLeftNotEdge = isBottomNotEdge && isLeftNotEdge;

      const bottomRight = bottom + 1;
      const isBottomRightNotEdge = isBottomNotEdge && isRightNotEdge;

      const fields = [
        isTopNotEdge && top,
        isLeftNotEdge && left,
        isRightNotEdge && right,
        isBottomNotEdge && bottom,
        isTopLeftNotEdge && topLeft,
        isTopRightNotEdge && topRight,
        isBottomLeftNotEdge && bottomLeft,
        isBottomRightNotEdge && bottomRight,
      ].filter((x) => x != false);

      symbols.push(startIndex, ...fields);
      asterisk.push([startIndex, ...fields]);
    }
  });

  if (part === 1) {
    const unfitted = digits
      .filter((d) => {
        return Boolean(
          symbols.find((s) => d.startIndex === s || d.endIndex === s)
        );
      })
      .map((d) => d.digit)
      .reduce((c, p) => c + p);

    return unfitted;
  }

  let secondResult = 0;

  asterisk.forEach((s) => {
    const neighborhoods = digits.filter(
      (d) => s.includes(d.startIndex) || s.includes(d.endIndex)
    );

    if (neighborhoods.length == 2) {
      secondResult =
        secondResult + neighborhoods[0].digit * neighborhoods[1].digit;
    }
  });

  return secondResult;
};

const firstTest = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`;

console.log("First test:\t", solvePuzzle(firstTest, 1));
console.log("Second test:\t", solvePuzzle(firstTest, 2));

const dayInput = fs
  .readFileSync(path.join(__dirname, "../input/3.txt"))
  .toString();

console.log("First part:\t", solvePuzzle(dayInput, 1));
console.log("Second part:\t", solvePuzzle(dayInput, 2));
