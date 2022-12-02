import { readInput, sum } from "../utils.js";

const { values } = await readInput({ sourceUrl: import.meta.url, parser: l => l.split(" ") });

// part 1

const ROCK = 1;
const PAPER = 2;
const SCISSORS = 3;

const WIN = 6;
const DRAW = 3;
const LOSE = 0;

const SCORES1 = {
  A: {
    X: ROCK + DRAW,
    Y: PAPER + WIN,
    Z: SCISSORS + LOSE
  },
  B: {
    X: ROCK + LOSE,
    Y: PAPER + DRAW,
    Z: SCISSORS + WIN
  },
  C: {
    X: ROCK + WIN,
    Y: PAPER + LOSE,
    Z: SCISSORS + DRAW
  }
};

const resolver = (scores) => sum(values.map(v => scores[v[0]][v[1]]));

console.log(resolver(SCORES1));

// part 2

const SCORES2 = {
  A: {
    X: SCISSORS + LOSE,
    Y: ROCK + DRAW,
    Z: PAPER + WIN
  },
  B: {
    X: ROCK + LOSE,
    Y: PAPER + DRAW,
    Z: SCISSORS + WIN
  },
  C: {
    X: PAPER + LOSE,
    Y: SCISSORS + DRAW,
    Z: ROCK + WIN
  }
};

console.log(resolver(SCORES2));
