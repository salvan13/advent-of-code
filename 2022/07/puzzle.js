import { readInput, sum } from "../utils.js";
import { dirFinder, makeFS } from "./fs.js";

const { values: terminal } = await readInput({ sourceUrl: import.meta.url, parser: l => l.split(' ') });

// part 1

const fileSystem = makeFS(terminal);

console.log(sum(dirFinder(fileSystem, (dir) => dir.size < 100_000).map(d => d.size)));

// part 2

const TOTAL_SPACE = 70_000_000;
const UPDATE_SPACE = 30_000_000;
const freeSpace = TOTAL_SPACE - fileSystem.size;
const neededSpace = UPDATE_SPACE - freeSpace;

console.log(Math.min(...dirFinder(fileSystem, (dir) => dir.size >= neededSpace).map(d => d.size)));
