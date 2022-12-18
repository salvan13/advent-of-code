import { readInput } from "../utils.js";

const parser = l => l.split(",").map(n => parseInt(n, 10));

const { values } = await readInput({ sourceUrl: import.meta.url, parser });

// part 1

const cubes = values.map(a => ({
  x: a[0],
  y: a[1],
  z: a[2]
}));

const connecteds = (a, b) => {
  if (a.x === b.x && a.y === b.y && Math.abs(a.z - b.z) === 1) {
    return true;
  }
  if (a.x === b.x && a.z === b.z && Math.abs(a.y - b.y) === 1) {
    return true;
  }
  if (a.z === b.z && a.y === b.y && Math.abs(a.x - b.x) === 1) {
    return true;
  }
  return false;
};

const countConnecteds = () => {
  let n = 0

  for (let x = 0; x < cubes.length; x++) {
    const cubeA = cubes[x];
    for (let y = x + 1; y < cubes.length; y++) {
      const cubeB = cubes[y];

      if (connecteds(cubeA, cubeB)) {
        n++;
      }
    }
  }

  return n;
}

const externalSurface = cubes.length * 6 - countConnecteds() * 2;

console.log(externalSurface);
