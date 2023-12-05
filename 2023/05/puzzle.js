import { readInput } from "../utils.js";
import { Almanac } from "./entities.js";

const { values } = await readInput({ sourceUrl: import.meta.url });


PART_1: {
  const almanac = new Almanac(values);
  console.log(Math.min(...almanac.getLocations()));
}
