import { fetchData } from "./fetch-data.ts";

let data: number[];

const getData = async () => {
  if (data) {
    return data;
  }
  const rawData = (await (await fetchData(1)).text()) as string;
  data = rawData.split("\n").map((x) => Number.parseInt(x, 10));
  return data;
};

const increaseCount = (array: number[]) => {
  return array.reduce((prev, current, index, arr) => {
    if (index === 1) {
      prev = 0;
    }
    if (current > arr[index - 1]) {
      return prev + 1;
    }
    return prev;
  });
};

const firstPart = async () => {
  const array = await getData();
  console.log(`Answer on first part: ${increaseCount(array)}`);
};

const secondPart = async () => {
  const array = await getData();
  const result = [];
  for (let i = 0; i < array.length; i++) {
    result.push(array[i] + array[i + 1] + array[i + 2]);
  }
  console.log(`Answer on second part: ${increaseCount(result)}`);
};

firstPart().then((x) => secondPart());
