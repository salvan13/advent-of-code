import { readInput } from "../utils.js";
import { getRock } from "./rocks.js";

const { lines: { 0: jets } } = await readInput({ sourceUrl: import.meta.url });

// part 1

const printGrid = grid => {
  const h = Math.max(...grid.map(g => g.length));
  const rows = [];
  for (let y = h - 1; y >= 0; y--) {
    const row = new Array(grid.length).fill(".");
    for (let x = 0; x < grid.length; x++) {
      row[x] = grid[x][y] === 1 ? "#" : ".";
    }
    rows.push(row.join(""));
  }
  console.log(rows.join("\n"));
};

const run = ({ steps }) => {

  const grid = Array.from({ length: 7 }, () => []);

  let jetN = 0;

  const gridH = () => Math.max(...grid.map(g => g.length));

  const step = (stepN) => {
    const rock = getRock(stepN);

    let rY = gridH() + 3 + rock.h - 1;
    let rX = 2;

    let stop = false;

    const isAreaFree = (area, rock) => area.every((row, y) => {
      return row.every((cell, x) => {
        return !(cell && rock[y][x]);
      });
    });

    const isValidPos = (x, y) => {
      if (x < 0 || (y - rock.h + 1) < 0 || (x + rock.w) > grid.length) {
        return false;
      }
      const area = Array.from({ length: rock.h }, (_, py) => Array.from({ length: rock.w }, (_, px) => {
        const posX = x + px;
        const posY = y - py;
        return grid[posX][posY] || 0;
      }));
      const isFree = isAreaFree(area, rock.s);
      return isFree;
    };

    const placeRock = () => {
      for (let y = 0; y < rock.s.length; y++) {
        const row = rock.s[y];
        for (let x = 0; x < row.length; x++) {
          const cell = row[x];
          const posX = rX + x;
          const posY = rY - y;
          if (cell && !grid[posX][posY]) {
            grid[posX][posY] = 1;
          };
        }
      }

      stop = true;
    };

    const fall = () => {
      let nextY = rY - 1;
      if (isValidPos(rX, nextY)) {
        rY = nextY;
      } else {
        placeRock();
      }
    };

    const jet = () => {
      const j = jets[jetN++ % jets.length];
      let nextX = rX + (j === ">" ? 1 : -1);
      if (isValidPos(nextX, rY)) {
        rX = nextX;
      }
    };

    while (!stop) {
      jet();
      fall();
    }
  }

  for (let s = 0; s < steps; s++) {
    step(s);
  }

  printGrid(grid);
  console.log("grid H", gridH());
};

run({ steps: 2022 });
