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
  paths: state.paths.map(p => [...p]),
  closed: [...state.closed],
  rates: [...state.rates],
  visits: { ...state.visits },
  blockeds: [...state.blockeds],
  history: [...state.history]
});

console.log(valves);

const find = ({ start, minutes, people }) => {
  const state = {
    pressure: 0, // actual pressure
    minutes, // minutes left
    paths: new Array(people.length).fill().map(() => [start]), // current path
    closed: [...valvesWithRate], // closed valves ids
    rates: [], // open valves rates
    visits: {}, // visits per valve
    blockeds: new Array(people.length).fill().map(() => false), // is blocked while opening a valve
    history: []
  };

  const step = (state) => {
    if (state.minutes <= 0) {
      return state;
    }

    state.minutes--;
    state.pressure += sum(state.rates);

    state.history.push(`min: ${minutes - state.minutes}, pressure: ${state.pressure} (${sum(state.rates)})`);

    people.forEach((personName, personIndex) => {
      const curr = state.paths[personIndex].at(-1);

      if (state.blockeds[personIndex]) {
        state.history.push(`${personName} is opening a valve, skip`);
        state.blockeds[personIndex] = false;
        return;
      }

      state.history.push(`${personName} is visiting ${curr}`);

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
          state.blockeds[personIndex] = true;
          state.history.push(`${personName} started opening valve ${curr}`);
        }
      }

      if (!state.visits[curr]) {
        state.visits[curr] = 0;
      }
      state.visits[curr]++;
    });

    if (!state.closed.length) {
      // wait the end
      return step(copy(state));
    }

    const newPaths = new Array(people.length).fill().map(() => []);

    for (let personIndex = 0; personIndex < people.length; personIndex++) {
      const curr = state.paths[personIndex].at(-1);
      const prev = state.paths[personIndex].at(-2);

      if (!state.blockeds[personIndex]) {
        for (let t = 0; t < valves[curr].tunnels.length; t++) {
          const next = valves[curr].tunnels[t];

          if (state.visits[next] >= 2) {
            continue;
          }

          const notImportant = valves[curr].rate === 0 || !state.closed.includes(curr);
          if (valves[curr].tunnels.length > 1 && notImportant && prev === next) {
            // don't go back if not needed
            continue;
          }

          newPaths[personIndex].push(next);
        }
      }
    }

    if (people.length === 1) {
      const results = [];
      for (let i = 0; i < newPaths[0].length; i++) {
        const nextA = newPaths[0][i];
        results.push(step({ ...copy(state), paths: [state.paths[0].concat([nextA])] }));
      }
      const ss = results.sort((a, b) => b.pressure - a.pressure);
      return ss.length > 0 ? ss.at(0) : step({ ...copy(state) });
    }

    if (people.length === 2) {
      const results = [];

      if (newPaths[0].length && newPaths[1].length) {
        for (let i = 0; i < newPaths[0].length; i++) {
          const nextA = newPaths[0][i];
          for (let j = 0; j < newPaths[1].length; j++) {
            const nextB = newPaths[1][j];
            results.push(step({ ...copy(state), paths: [state.paths[0].concat([nextA]), state.paths[1].concat([nextB])] }));
          }
        }
      } else if (newPaths[0].length) {
        for (let i = 0; i < newPaths[0].length; i++) {
          const nextA = newPaths[0][i];
          results.push(step({ ...copy(state), paths: [state.paths[0].concat([nextA]), [...state.paths[1]]] }));
        }
      } else if (newPaths[1].length) {
        for (let i = 0; i < newPaths[1].length; i++) {
          const nextA = newPaths[1][i];
          results.push(step({ ...copy(state), paths: [[...state.paths[0]], state.paths[1].concat([nextA])] }));
        }
      }

      const ss = results.sort((a, b) => b.pressure - a.pressure);
      return ss.length > 0 ? ss.at(0) : step({ ...copy(state) });
    }
  };

  console.log(step(state));
};

find({ start: "AA", minutes: 30, people: ["antonio"] });

// part 2

find({ start: "AA", minutes: 26, people: ["elephant", "antonio"] });
