import { readInput, sum } from "../utils.js";
import { Sensor } from "./entities.js";

const parser = line => {
  const nums = line.match(/(-)?\d+/g).map(n => parseInt(n));
  return new Sensor(...nums);
};

const { values: sensors } = await readInput({ sourceUrl: import.meta.url, parser });

// part 1

const unavailabePositions = (y, min = -Infinity, max = Infinity) => sensors
  .map(s => s.row(y))
  .filter(d => !!d)
  .sort((a, b) => a.start - b.start)
  .reduce((a, c) => {
    if (c.end < min || c.max > max) {
      return a;
    }
    const curr = a.at(-1);
    if (!curr) {
      a.push(c);
    } else {
      if (c.start <= curr.end && c.end > curr.end) {
        curr.end = c.end;
      } else if (c.start > curr.end) {
        a.push(c);
      }
    }
    return a;
  }, []);

console.log(sum(unavailabePositions(2_000_000).map(r => r.end - r.start)));

// part 2

const search = (max) => {
  let y = max;

  while (y--) {
    const uY = unavailabePositions(y, 0, max);
    if (uY.length > 1 && (uY[1].start - uY[0].end) > 1) {
      return {
        y,
        x: uY[0].end + 1
      }
    }
  }
}

const max = 4_000_000;
const beacon = search(max);
console.log(beacon.x * max + beacon.y)
