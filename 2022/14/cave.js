const START_COL = 500;

export const makeCave = (values) => {
  const cave = { [START_COL]: ["+"] };

  const fullPath = path => path.reduce((a, [col, row]) => {
    if (a.length) {
      const prev = a.at(-1);
      let points = [];
      if (prev[0] === col) {
        points = Array.from({ length: Math.abs(prev[1] - row) - 1 }, (_, i) => [col, Math.min(prev[1], row) + i + 1]);
      } else {
        points = Array.from({ length: Math.abs(prev[0] - col) - 1 }, (_, i) => [Math.min(prev[0], col) + i + 1, row]);
      }
      a = [...a, ...points];
    }
    a.push([col, row]);
    return a;
  }, []);


  const addPath = path => {
    fullPath(path).forEach(([col, row]) => {
      if (!cave[col]) {
        cave[col] = [];
      }
      cave[col][row] = "#";
    })
  };

  values.forEach(path => addPath(path));

  const colsIndexes = Object.keys(cave).map(k => parseInt(k, 10));
  const firstCol = Math.min(...colsIndexes);
  const lastCol = Math.max(...colsIndexes);
  const lastRow = Math.max(...Object.keys(cave).map(col => cave[col].length));

  return { cave, firstCol, lastCol, lastRow };
};

export const fall = ({ cave, firstCol, lastCol, lastRow }) => {
  const sand = [START_COL, 0];

  const isFree = (col, row) => !cave[col] || !cave[col][row];

  const step = () => {
    if (sand[0] > lastCol || sand[0] < firstCol || sand[1] > lastRow || cave[sand[0]][sand[1]] === "o") {
      return false;
    }

    if (isFree(sand[0], sand[1] + 1)) {
      sand[1]++;
      return;
    } else if (isFree(sand[0] - 1, sand[1] + 1)) {
      sand[0]--;
      sand[1]++;
      return;
    } else if (isFree(sand[0] + 1, sand[1] + 1)) {
      sand[0]++;
      sand[1]++;
      return;
    }

    cave[sand[0]][sand[1]] = "o";
    return true;
  };

  while (1) {
    const r = step();
    if (typeof r === "boolean") {
      return r;
    }
  }
};

export const printCave = ({ cave, firstCol, lastCol, lastRow }) => {

  const grid = new Array(lastRow).fill().map(() => new Array(lastCol - firstCol + 1).fill("X"));

  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      row[x] = cave[firstCol + x][y] || ".";
    }
  }

  console.log({ firstCol, lastCol, lastRow });
  console.log(grid.map(row => row.join("")).join("\n"));
};
