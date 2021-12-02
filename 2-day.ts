import { fetchData } from "./fetch-data.ts";

let data: { direction: "forward" | "down" | "up"; velocity: number }[];

const getData = async () => {
  if (data) {
    return data;
  }
  data = [];
  const rawData = (await (await fetchData(2)).text()) as string;
  rawData.split("\n").forEach((x, ind) => {
    const res = x.split(" ");
    if (res[0].length < 1) {
      return;
    }
    data.push({
      direction: res[0] as "forward" | "down" | "up",
      velocity: Number.parseInt(res[1], 10),
    });
  });
  return data;
};

const partOne = async () => {
  const data = await getData();
  const result = {
    horizontal: 0,
    depth: 0,
  };
  data.forEach((x, ind) => {
    switch (x.direction) {
      case "down":
        result.depth = result.depth + x.velocity;
        return;
      case "up":
        result.depth = result.depth - x.velocity;
        return;
      case "forward":
        result.horizontal = result.horizontal + x.velocity;
        return;
      default:
        console.log(ind);
        throw new Error("Unexpected direction");
    }
  });
  console.log(`Answer on first part is ${result.depth * result.horizontal}`);
};

const partTwo = async () => {
  const data = await getData();
  const result = {
    horizontal: 0,
    depth: 0,
    aim: 0,
  };
  data.forEach((x, ind) => {
    switch (x.direction) {
      case "down":
        result.aim = result.aim + x.velocity;
        return;
      case "up":
        result.aim = result.aim - x.velocity;
        return;
      case "forward":
        result.horizontal = result.horizontal + x.velocity;
        result.depth = result.depth + result.aim * x.velocity;
        return;
      default:
        console.log(ind);
        throw new Error("Unexpected direction");
    }
  });
  console.log(`Answer on second part is ${result.depth * result.horizontal}`);
};

partOne().then((x) => partTwo());
