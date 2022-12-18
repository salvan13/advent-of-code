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

// part 2

const minX = Math.min(...cubes.map(c => c.x)) - 1;
const minY = Math.min(...cubes.map(c => c.y)) - 1;
const minZ = Math.min(...cubes.map(c => c.z)) - 1;
const maxX = Math.max(...cubes.map(c => c.x)) + 1;
const maxY = Math.max(...cubes.map(c => c.y)) + 1;
const maxZ = Math.max(...cubes.map(c => c.z)) + 1;

const getAllPositions = () => {
  const positions = [];

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      for (let z = minZ; z <= maxZ; z++) {
        const cube = cubes.find(c => c.x === x && c.y === y && c.z === z);
        if (cube) {
          positions.push({ ...cube, type: "solid" });
        } else {
          positions.push({ x, y, z, type: "air" });
        }
      }
    }
  }

  return positions;
};

const positions = getAllPositions();

const getAdjacentPositions = p => {
  const ps = [];
  for (let i = 0; i < positions.length; i++) {
    if (connecteds(p, positions[i])) {
      ps.push(positions[i]);
    }
  }
  return ps;
};

const markExternalPositions = c => {
  const adjs = getAdjacentPositions(c);

  if (c.type === "air" && (adjs.length < 6 || adjs.find(a => a.type === "external"))) {
    c.type = "external";
  }

  for (let i = 0; i < adjs.length; i++) {
    if (adjs[i].type === "air") {
      markExternalPositions(adjs[i]);
    }
  }
};

markExternalPositions(positions.find(p => p.x === minX && p.y === minY && p.z === minZ));

const countExternalSides = () => {
  let n = 0

  for (let x = 0; x < cubes.length; x++) {
    const cube = cubes[x];
    const adjs = getAdjacentPositions(cube);
    n += adjs.filter(p => p.type === "external").length;
  }

  return n;
}

console.log(countExternalSides());

// run node with the option --stack-size=65500 in part 2
