import { readInput, sum } from "../utils.js";
import SNAFU from "./SNAFU.js";

const { values } = await readInput({ sourceUrl: import.meta.url, parser: num => new SNAFU(num) });

// part 1

const val = sum(values.map(v => v.toNumber()));
const snafuVal = SNAFU.fromNumber(val);
console.log(snafuVal.toString());
