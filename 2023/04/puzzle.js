import { readInput, sum } from "../utils.js";
import { parser } from "./parser.js";

const { values: cards } = await readInput({ sourceUrl: import.meta.url, parser });

PART_1: {
  console.log(sum(cards.map(card => card.getPoints())));
}

PART_2: {
  const bag = [];
  cards.forEach(c => bag.push([c]));

  bag.forEach((cards, i) => {
    cards.forEach(card => {
      const mn = card.getMatchingNumbers();
      for (let x = i + 1; x < i + 1 + mn.length; x++) {
        bag[x] && bag[x].push(bag[x][0].clone());
      }
    });
  });

  console.log(bag.flat().length);
}
