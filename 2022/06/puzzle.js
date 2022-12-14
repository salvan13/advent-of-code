import { readInput } from "../utils.js";

const { values: { 0: stream } } = await readInput({ sourceUrl: import.meta.url, parser: l => l.split('') });

// part 1

const findMarker = n => n + stream.findIndex((_, i, a) => new Set(new Array(n).fill().map((_, x) => a[i + x])).size === n);

console.log(findMarker(4));

// part 2

console.log(findMarker(14));
