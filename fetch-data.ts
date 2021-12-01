import { config } from "https://deno.land/x/dotenv/mod.ts";

const env = config();

if (!env.SESSION) {
  throw new Error("Please, provide session id");
}

function fetchData(day: number) {
  return fetch(`https://adventofcode.com/2021/day/${day}/input`, {
    headers: {
      Cookie: `session=${env.SESSION}`,
    },
  });
}

export { fetchData };
