import { readInput } from "../utils.js";
import { Knot } from "./entities.js";

const parser = line => {
  const parts = line.split(' ');
  return {
    dir: parts[0],
    steps: parseInt(parts[1], 10)
  }
};

const { values: moves } = await readInput({ sourceUrl: import.meta.url, parser });

// part 1

const head = new Knot();
const tail = new Knot();

for (let i = 0; i < moves.length; i++) {
  const move = moves[i];
  let steps = move.steps;
  while (steps--) {
    head.move(move.dir);
    tail.follow(head);
  }
}

console.log(tail.uniquePositions());

// part 2

const rope = new Array(10).fill().map(() => new Knot());

for (let i = 0; i < moves.length; i++) {
  const move = moves[i];
  let steps = move.steps;
  while (steps--) {
    rope[0].move(move.dir);
    for (let x = 1; x < rope.length; x++) {
      rope[x].follow(rope[x - 1]);
    }
    tail.follow(head);
  }
}

console.log(rope.at(-1).uniquePositions());
