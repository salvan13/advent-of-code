import { readInput } from "../utils.js";
import { Map } from "./entities.js";

const { values } = await readInput({ sourceUrl: import.meta.url, parser: l => l.split("") });

// part 1

const run = (rounds = Infinity) => {
  const map = new Map(values);

  const consider = () => {
    for (const elf of map.elves) {
      if (elf.adjacentPositions().every(pos => !map.at(pos).length)) {
        continue;
      }
      for (const dir of elf.priorities) {
        const poss = elf.adjacentPositions(dir);
        if (poss.every(pos => !map.at(pos).length)) {
          elf.proposal = poss.find(p => p.x === elf.pos.x || p.y === elf.pos.y);
          break;
        }
      }
    }
  };

  const move = () => {
    for (const elf of map.elves) {
      if (elf.proposal && map.at(elf.proposal, { checkProposal: true }).length === 1) {
        elf.move();
      }
    }
  };

  const finalize = () => {
    for (const elf of map.elves) {
      elf.finalize();
    }
  };


  let r = 1;
  while (r <= rounds) {
    console.log("round", r);
    consider();
    move();
    if (map.elves.every(elf => !elf.moved)) {
      break;
    }
    finalize();
    map.emptyCache();
    r++;
  }

  return { map, rounds: r };
};

{
  const { map } = run(10);

  //map.print();
  console.log(map.freeSpots());
}

// part 2
{
  const { rounds } = run();
  console.log(rounds);
}
