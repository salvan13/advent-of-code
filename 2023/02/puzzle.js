import { readInput, sum } from "../utils.js";
import { parser } from "./parser.js";

const { values: games } = await readInput({ sourceUrl: import.meta.url, parser });

PART_1: {
  const check = (games, checks) => {
    return sum(games.filter(game => game.isPossible(checks)).map(game => game.id));
  };

  console.log(check(games, { red: 12, green: 13, blue: 14 }));
}

PART_2: {
  const check = (games) => {
    return sum(games.map(game => game.getPower()));
  };

  console.log(check(games));
}
