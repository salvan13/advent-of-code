import { readInput, sum } from "../utils.js";
import { Grid } from "./entities.js";

const { values } = await readInput({ sourceUrl: import.meta.url, parser: l => l.split("") });

PART_1: {
  const grid = new Grid(values);
  grid.checkParts();
  console.log(grid.sumParts());
}

PART_2: {
  const grid = new Grid(values);
  grid.checkParts();
  console.log(grid.sumGears());
}
