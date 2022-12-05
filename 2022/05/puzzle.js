import { readInput } from "../utils.js";

const parser = l => {
  const v = l.split(' ').map(i => parseInt(i, 10)).filter(n => Number.isFinite(n));
  return {
    quantity: v[0],
    from: v[1],
    to: v[2]
  }
};

const { values: moves } = await readInput({ sourceUrl: import.meta.url, parser });

const initialCargo = () => [
  "WDGBHRV".split(""),
  "JNGCRF".split(""),
  "LSFHDNJ".split(""),
  "JDSV".split(""),
  "SHDRQWNV".split(""),
  "PGHCM".split(""),
  "FJBGLZHC".split(""),
  "SJR".split(""),
  "LGSRBNVM".split("")
];

// part 1

const solve = (fn) => {
  const cargo = initialCargo();

  moves.forEach(move => {
    let stpes = move.quantity;
    let crates = [];

    while (stpes--) {
      crates.push(cargo[move.from - 1].pop());
    }

    if (fn) {
      crates = fn(crates);
    }

    crates.forEach(c => cargo[move.to - 1].push(c));
  });

  return cargo.map(c => c[c.length - 1]).join('');
};


console.log(solve());

// part 2

console.log(solve((crates) => crates.reverse()));
