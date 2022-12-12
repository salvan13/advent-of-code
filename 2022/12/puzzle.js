import { readInput } from "../utils.js";
import { makeGraph } from "./graph.js";

const { values } = await readInput({ sourceUrl: import.meta.url, parser: l => l.split("") });

// part 1

const graph = makeGraph(values);

const printMap = (path, start, end) => {
  const isInPath = (c, y, x) => {
    if (c === start || `${y}:${x}:${c}` === start) return `\x1b[43m${c}\x1b[0m`;
    if (c === end || `${y}:${x}:${c}` === end) return `\x1b[44m${c}\x1b[0m`;
    return path.find(v => v === `${y}:${x}:${c}`) ? `\x1b[42m${c}\x1b[0m` : c;
  };

  console.log(values.map((r, y) => r.map((c, x) => isInPath(c, y, x)).join("")).join("\n"));
};

{
  const path = graph.dijkstra("S", "E");
  printMap(path, "S", "E");
  console.log(path.length - 1);
}

// part 2

{
  const paths = [];
  for (let y = 0; y < values.length; y++) {
    const row = values[y];
    for (let x = 0; x < row.length; x++) {
      const c = row[x];
      if (c === "a") {
        const start = `${y}:${x}:a`;
        const end = "E";
        const path = graph.dijkstra(start, end);
        if (path.length > 1) {
          paths.push({ path, start, end });
        }
      }
    }
  }
  const shortest = paths.sort((p1, p2) => p2.path.length - p1.path.length).at(-1);
  printMap(shortest.path, shortest.start, shortest.end);
  console.log(shortest.path.length - 1);
}
