import { readInput } from "../utils.js";

const { values } = await readInput({ sourceUrl: import.meta.url });

// part 1

const map = values.slice(0, values.length - 2).map(row => row.split("").map(c => c.trim()));

const path = values.at(-1).match(/(\d+)([L|R]?)/g).map(s => ({
  rotate: ["L", "R"].includes(s.at(-1)) ? s.at(-1) : null,
  steps: parseInt(s.substring(0, s.length - (["L", "R"].includes(s.at(-1)) ? 1 : 0)))
}));

const DIRS = ["R", "D", "L", "U"];

const run = () => {
  let pos = { y: 0, x: map[0].findIndex(c => c === ".") };
  let dir = "R";
  const history = [];

  const rotate = side => {
    const idx = DIRS.indexOf(dir);
    dir = DIRS.at((idx + (side === "R" ? 1 : -1)) % DIRS.length);
  };

  const step = () => {
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
      nextCell = map.at(next.y).at(next.x);
    }

    if (nextCell === ".") {
      pos = next;
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

const printMap = (map, history) => {
  const m = map.map((row, y) => row.map((cell, x) => cell || " "));
  history.forEach(h => m[h.pos.y][h.pos.x] = h.dir);
  console.log(m.map(r => r.join("")).join("\n"));
};

const { pos, dir } = run();
console.log(pos, dir)
console.log((pos.y + 1) * 1000 + (pos.x + 1) * 4 + DIRS.indexOf(dir))
