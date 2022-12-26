import { readInput } from "../utils.js";
import { State } from "./entities.js";

const { values } = await readInput({ sourceUrl: import.meta.url, parser: l => l.split("") });

// part 1

const run = (state, compareStates, goBack = false, maxStates = 100) => {
  const { minX, minY, maxX, maxY } = state.size();

  let states = [state];

  const blizzardsMinuteCache = {};
  const wallsCache = {};

  const step = (state) => {
    state.minute++;

    // calculate blizzards positions one time per minute and cache them
    if (blizzardsMinuteCache[state.minute]) {
      state.blizzards = blizzardsMinuteCache[state.minute];
    } else {
      for (const blizz of state.blizzards) {
        while (true) {
          const newPos = blizz.nextPos({ minX, minY, maxX, maxY });
          blizz.pos = newPos;
          if (!state.wallAt(newPos)) {
            break;
          }
        }
      }
      blizzardsMinuteCache[state.minute] = state.blizzards;
    }

    for (const pos of state.me.availablePositions()) {
      const posKey = `${pos.y}:${pos.x}`;
      if (!wallsCache[posKey]) {
        // cache walls per position
        wallsCache[posKey] = state.wallAt(pos);
      }

      if (pos.y < 0 || pos.y > maxY || wallsCache[posKey] || state.blizzardsAt(pos).length > 0) {
        continue;
      }

      const newState = state.clone();
      newState.me.pos = pos;

      states.push(newState);
    }
  };

  while (states.length) {
    console.log(states[0].minute, states.length);
    const execute = [...states];
    states = [];
    for (const state of execute) {
      step(state);
    }

    const win = states.find(state => state.over(goBack));
    if (win) {
      return win;
    }

    // print all current positions each minute, quite expensive :/
    // if (states.length)
    //  printStates(states);

    // solution not found :(
    if (states.length === 0) {
      return execute.sort(compareStates)[0];
    }

    // exclude duplicated positions
    ({ states } = states.reduce((a, c) => {
      const key = `${c.me.pos.y}:${c.me.pos.x}`;
      if (!a.positions.has(key)) {
        a.states.push(c);
        a.positions.add(key);
      }
      return a;
    }, { states: [], positions: new Set() }));

    // use only better positions
    states = states.sort(compareStates).slice(0, maxStates);
  }
}

const printStates = (states) => {
  const debug = states.map(s => s.me);
  states[0].print(debug);
};

const state = new State(values);
const size = state.size();

const compareStatesGo = (a, b) => {
  const va = a.me.pos.x * size.maxX + a.me.pos.y * size.maxY;
  const vb = b.me.pos.x * size.maxX + b.me.pos.y * size.maxY;
  return vb - va;
};

const win1 = run(state, compareStatesGo);
win1.print();
console.log(win1.minute);

// part 2

const compareStatesBack = (a, b) => {
  const va = a.me.pos.x * size.maxX + a.me.pos.y * size.maxY;
  const vb = b.me.pos.x * size.maxX + b.me.pos.y * size.maxY;
  return vb - va;
};

const back = run(win1, compareStatesBack, true, 1000);
back.print();
console.log(back.minute);

const again = run(back, compareStatesGo);
again.print();
console.log(again.minute);
