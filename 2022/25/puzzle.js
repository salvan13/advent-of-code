import { readInput, sum } from "../utils.js";
import SNAFU from "./SNAFU.js";

const { values } = await readInput({ sourceUrl: import.meta.url, parser: num => new SNAFU(num) });

console.log(`${SNAFU.fromNumber(sum(values.map(v => v.toNumber())))}`);
