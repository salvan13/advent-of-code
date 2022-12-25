import { readInput } from "../utils.js";

const { values } = await readInput({ sourceUrl: import.meta.url });

// part 1

const map = values.slice(0, values.length - 2).map(row => row.split("").map(c => c.trim()));

const path = values.at(-1).match(/(\d+)([L|R]?)/g).map(s => ({
  rotate: ["L", "R"].includes(s.at(-1)) ? s.at(-1) : null,
  steps: parseInt(s.substring(0, s.length - (["L", "R"].includes(s.at(-1)) ? 1 : 0)))
}));

const DIRS = ["R", "D", "L", "U"];

const run = (findNextCell) => {
  let pos = { y: 0, x: map[0].findIndex(c => c === ".") };
  let dir = "R";
  const history = [];

  const rotate = side => {
    const idx = DIRS.indexOf(dir);
    dir = DIRS.at((idx + (side === "R" ? 1 : -1)) % DIRS.length);
  };

  const step = () => {
    const { nextPos, nextDir } = findNextCell({ pos, dir });
    const nextCell = map[nextPos.y][nextPos.x];

    if (nextCell === ".") {
      pos = nextPos;
      dir = nextDir;
      history.push({ pos, dir });
      return true;
    }

    return false;
  };

  for (let i = 0; i < path.length; i++) {
    for (let j = 0; j < path[i].steps; j++) {
      if (!step()) {
        break;
      }
    }
    path[i].rotate && rotate(path[i].rotate);
  }

  // printMap(map, history);
  return { pos, dir };
};

const printMap = (map, positions) => {
  const m = map.map(row => row.map(cell => cell || " "));
  positions.forEach(h => m[h.pos.y][h.pos.x] = h.dir);
  console.log(m.map(r => r.join("")).join("\n"));
};

const findNextCell = ({ pos, dir }) => {
  const next = { ...pos };
  let nextCell = null;

  while (!nextCell) {
    switch (dir) {
      case "L":
        next.x = (next.x - 1) < 0 ? map[next.y].length - 1 : next.x - 1;
        break;
      case "R":
        next.x = (next.x + 1) > map[next.y].length - 1 ? 0 : next.x + 1;
        break;
      case "U":
        next.y = (next.y - 1) < 0 ? map.length - 1 : next.y - 1;
        break;
      case "D":
        next.y = (next.y + 1) > map.length - 1 ? 0 : next.y + 1;
        break;
    }
    nextCell = map[next.y][next.x];
  }

  return {
    nextPos: next,
    nextDir: dir
  };
};

{
  const { pos, dir } = run(findNextCell);
  console.log((pos.y + 1) * 1000 + (pos.x + 1) * 4 + DIRS.indexOf(dir))
}

// part 2

const portals = {};

const range = (start, end) => {
  if (start < end) {
    return new Array(end - start + 1).fill().map((_, i) => i + start);
  } else {
    return new Array(start - end + 1).fill().map((_, i) => start - i);
  }
}

const addPortals = (a, b, dirA, dirB) => {
  const pa = [];
  const pb = [];
  for (const y of range(...a.y)) {
    for (const x of range(...a.x)) {
      pa.push({ y, x })
    }
  }
  for (const y of range(...b.y)) {
    for (const x of range(...b.x)) {
      pb.push({ y, x })
    }
  }
  if (pa.length !== pb.length) {
    throw new Error("oops")
  }
  for (let i = 0; i < pa.length; i++) {
    portals[`${pa[i].y}:${pa[i].x}:${dirA}`] = { pos: pb[i], dir: dirB };
  }
};

// test portals
// addPortals({ y: [4, 7], x: [12, 12] }, { y: [8, 8], x: [15, 12] }, "R", "D");
// addPortals({ y: [12, 12], x: [8, 11] }, { y: [7, 7], x: [3, 0] }, "D", "U");
// addPortals({ y: [3, 3], x: [4, 7] }, { y: [0, 3], x: [8, 8] }, "U", "R");

// input portals
addPortals({ y: [-1, -1], x: [50, 99] }, { y: [150, 199], x: [0, 0] }, "U", "R");
addPortals({ y: [-1, -1], x: [100, 149] }, { y: [199, 199], x: [0, 49] }, "U", "U");
addPortals({ y: [0, 49], x: [49, 49] }, { y: [149, 100], x: [0, 0] }, "L", "R");
addPortals({ y: [0, 49], x: [150, 150] }, { y: [149, 100], x: [99, 99] }, "R", "L");
addPortals({ y: [50, 50], x: [100, 149] }, { y: [50, 99], x: [99, 99] }, "D", "L");
addPortals({ y: [50, 99], x: [100, 100] }, { y: [49, 49], x: [100, 149] }, "R", "U");
addPortals({ y: [50, 99], x: [49, 49] }, { y: [100, 100], x: [0, 49] }, "L", "D");
addPortals({ y: [99, 99], x: [0, 49] }, { y: [50, 99], x: [50, 50] }, "U", "R");
addPortals({ y: [100, 149], x: [100, 100] }, { y: [49, 0], x: [149, 149] }, "R", "L");
addPortals({ y: [150, 150], x: [50, 99] }, { y: [150, 199], x: [49, 49] }, "D", "L");
addPortals({ y: [100, 149], x: [-1, -1] }, { y: [49, 0], x: [50, 50] }, "L", "R");
addPortals({ y: [200, 200], x: [0, 49] }, { y: [0, 0], x: [100, 149] }, "D", "D");
addPortals({ y: [150, 199], x: [-1, -1] }, { y: [0, 0], x: [50, 99] }, "L", "D");
addPortals({ y: [150, 199], x: [50, 50] }, { y: [149, 149], x: [50, 99] }, "R", "U");

const findNextCubeCell = ({ pos, dir }) => {
  const next = { ...pos };

  switch (dir) {
    case "L":
      next.x--;
      break;
    case "R":
      next.x++;
      break;
    case "U":
      next.y--;
      break;
    case "D":
      next.y++;
      break;
  }

  const nextCell = map[next.y] && map[next.y][next.x];

  if (!nextCell) {
    const p = portals[`${next.y}:${next.x}:${dir}`];
    next.x = p.pos.x;
    next.y = p.pos.y;
    dir = p.dir;
  }

  return {
    nextPos: next,
    nextDir: dir
  };
};

{
  const { pos, dir } = run(findNextCubeCell);
  console.log((pos.y + 1) * 1000 + (pos.x + 1) * 4 + DIRS.indexOf(dir))
}
