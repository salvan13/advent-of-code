import { readInput } from "../utils.js";

const { values: grid } = await readInput({ sourceUrl: import.meta.url, parser: l => l.split('').map(n => parseInt(n, 10)) });

// part 1

const subRow = (y, start, end) => grid[y].slice(start, end);

const subCol = (x, start, end) => new Array(end - start).fill().map((_, y) => grid[y + start][x]);

const mapCell = ({ x, y }, calcScore) => {
  const height = grid[y][x];

  const sides = [
    subRow(y, 0, x).reverse(),
    subRow(y, x + 1, grid[y].length),
    subCol(x, 0, y).reverse(),
    subCol(x, y + 1, grid.length)
  ];

  return {
    visible: !!sides.map(side => side.every(t => t < height)).find(v => v),
    score: calcScore(height, sides)
  }
};

const calcScore = (height, sides) =>
  sides.map(side => {
    const visibles = side.findIndex(t => t >= height);
    return visibles === -1 ? side.length : visibles + 1;
  }).reduce((a, c) => a * c, 1);

const map = grid.map((row, y) => row.map((_, x) => mapCell({ x, y }, calcScore)));

console.log(map.flat().filter(c => c.visible).length)

// part 2

console.log(Math.max(...map.flat().map(c => c.score)));
