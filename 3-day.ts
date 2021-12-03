import { fetchData } from "./fetch-data.ts";

let data: number[][];
let frequency: number[];
const test =
  "00100\n11110\n10110\n10111\n10101\n01111\n00111\n11100\n10000\n11001\n00010\n01010\n";

const getData = async () => {
  if (data) {
    return data;
  }

  const response = await fetchData(3);
  const rawData = (await response.text()) as string;
  data = [];
  rawData.split("\n").forEach((bites) => {
    if (bites.length < 5) {
      return;
    }
    for (let i = 0; i < bites.length; i++) {
      if (!data[i]) {
        data[i] = [];
      }
      data[i].push(Number.parseInt(bites[i], 2));
    }
  });

  return data;
};

const countFrequency = (data: number[][]) => {
  const frequency: number[] = [];
  data.forEach((x) => {
    const counts = [0, 0];
    x.forEach((prev) => {
      counts[prev]++;
    });
    frequency.push(counts[0] > counts[1] ? 0 : 1);
  });
  return frequency;
};

const partOne = async () => {
  const data = await getData();
  const frequency = countFrequency(data);
  const gammaRaw = Number.parseInt(frequency.join(""), 2);
  const epsilonRaw = Number.parseInt(
    frequency
      .map((x) => {
        return x === 1 ? 0 : 1;
      })
      .join(""),
    2
  );

  console.log(`Answer on first part is ${gammaRaw * epsilonRaw}`);
};

function reduce(
  data: number[][],
  compare: (origin: number, target: number) => boolean
) {
  let currentBite = 0;
  let selectedIndexes = Array.from({ length: data[0].length })
    .fill(0)
    .map((x, ind) => ind);

  while (selectedIndexes.length > 1) {
    const newSelection: number[] = [];

    const newData: number[][] = [];
    data.forEach((x, ind) => {
      newData[ind] = x.filter((x, index) => selectedIndexes.includes(index));
    });

    let frequency = countFrequency(newData);
    for (let i = 0; i < selectedIndexes.length; i++) {
      if (
        compare(data[currentBite][selectedIndexes[i]], frequency[currentBite])
      ) {
        newSelection.push(selectedIndexes[i]);
      }
    }
    selectedIndexes = newSelection;
    currentBite++;
  }
  let oxygen = "";
  data.forEach((x) => {
    oxygen = `${oxygen}${x[selectedIndexes[0]]}`;
  });
  return Number.parseInt(oxygen, 2);
}

const partTwo = async () => {
  let data = await getData();

  const oxygen = reduce(data, (origin, target) => {
    return origin === target;
  });

  const emission = reduce(data, (origin, target) => {
    return origin !== target;
  });

  console.log(`Answer on second part is ${emission * oxygen}`);
};

partOne().then(() => partTwo());
