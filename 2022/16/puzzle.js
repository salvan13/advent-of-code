import { readInput, sum } from "../utils.js";
import { parser } from "./parser.js";

const { values } = await readInput({ sourceUrl: import.meta.url, parser });

// part 1

const valves = values.reduce((a, c) => {
  a[c.id] = c;
  return a;
}, {});

const valvesWithRate = values.filter(v => v.rate > 0).map(v => v.id);

const dist = (graph, start, target) => {
  const queue = [start];
  const visited = new Set([start]);
  let distance = 0;

  while (queue.length) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      if (node === target) {
        return distance;
      }
      for (const neighbor of graph[node]) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
          visited.add(neighbor);
        }
      }
    }
    distance++;
  }
}

const distances = (() => {
  const graph = {};

  for (let i = 0; i < values.length; i++) {
    const valve = values[i];
    const d = [];
    for (let j = 0; j < valve.tunnels.length; j++) {
      const v = valve.tunnels[j];
      d.push(v);
    }
    graph[valve.id] = d;
  }

  const dists = {};
  for (const a in valves) {
    dists[a] = [];
    for (const b in valves) {
      dists[a][b] = dist(graph, a, b);
    }
  }

  return dists;
})();

const copy = state => ({
  ...state,
  path: [...state.path],
  closed: [...state.closed],
  rates: [...state.rates],
  visits: { ...state.visits }
});

console.log(valves);

const find = ({ start, minutes }) => {
  const state = {
    pressure: 0, // actual pressure
    minutes, // minutes left
    path: [start], // current path
    closed: [...valvesWithRate], // closed valves ids
    rates: [], // open valves rates
    visits: {} // visits per valve
  };

  const step = (state) => {
    if (state.minutes <= 0) {
      return state;
    }

    const tick = () => {
      state.minutes--;
      state.pressure += sum(state.rates);
    };

    tick();

    const curr = state.path.at(-1);
    const prev = state.path.at(-2);

    const solutions = [];
    for (let i = 0; i < state.closed.length; i++) {
      const other = state.closed[i];
      if (curr !== other) {
        const dist = distances[curr][other];
        const currOpen = valves[curr].rate * (state.minutes - 1) + valves[other].rate * (state.minutes - dist - 2);
        const otherOpen = valves[other].rate * (state.minutes - dist - 1) + valves[curr].rate * (state.minutes - dist * 2 - 2);
        const diff = otherOpen - currOpen;
        solutions.push({ curr, other, currOpen, otherOpen, diff, better: currOpen >= otherOpen ? curr : other });
      }
    }

    if (state.minutes && state.closed.includes(curr)) {
      if (solutions.every(s => s.better === curr)) {
        state.rates.push(valves[curr].rate);
        state.closed = state.closed.filter(x => x !== curr);
        tick();
      }
    }

    if (!state.closed.length) {
      // wait the end
      return step(copy(state));
    }

    if (!state.visits[curr]) {
      state.visits[curr] = 0;
    }
    state.visits[curr]++;

    const ss = valves[curr].tunnels.map(next => {
      if (state.visits[next] >= 3) {
        return null;
      }

      const notImportant = valves[curr].rate === 0 || !state.closed.includes(curr);
      if (valves[curr].tunnels.length > 1 && notImportant && prev === next) {
        // don't go back if not needed
        return null;
      }

      return step({ ...copy(state), path: state.path.concat([next]) });
    }).filter(s => !!s).sort((a, b) => b.pressure - a.pressure);

    return ss.length > 0 ? ss.at(0) : state;
  };

  console.log(step(state));
};

find({ start: "AA", minutes: 30 });
