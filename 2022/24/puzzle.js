import { readInput } from "../utils.js";
import { State } from "./entities.js";

const { values } = await readInput({ sourceUrl: import.meta.url, parser: l => l.split("") });

// part 1

const run = () => {
  const state = new State(values);

  let states = [state];

  const cache = {};

  const step = (state) => {
    state.minute++;

    const { minX, minY, maxX, maxY } = state.size();

    if (cache[state.minute]) {
      state.blizzards = cache[state.minute];
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
      cache[state.minute] = state.blizzards;
    }


    let usedPos = 0;

    for (const pos of state.me.availablePositions()) {
      if (usedPos >= 2) {
        //break;
      }

      if (pos.y < 0 || state.wallAt(pos) || state.blizzardsAt(pos).length > 0) {
        continue;
      }

      const newState = state.clone();
      newState.me.pos = pos;

      states.push(newState);

      usedPos++;
    }
  };

  const compareStates = (a, b) => {
    const s = a.size();
    const va = a.me.pos.x * s.maxX + a.me.pos.y * s.maxY;
    const vb = b.me.pos.x * s.maxX + b.me.pos.y * s.maxY;
    return vb - va;
  };

  while (states.length) {
    console.log(states[0].minute, states.length)
    const execute = [...states];
    states = [];
    for (const state of execute) {
      step(state);
      //state.print()
    }

    const win = states.find(state => state.over());
    if (win) {
      return win;
    }

    //if (states.length)
    //  printStates(states);

    if (states.length === 0) {
      return execute.sort(compareStates)[0];
    }

    // exclude duplicated
    ({ states } = states.reduce((a, c) => {
      const key = `${c.me.pos.y}:${c.me.pos.x}`;
      if (!a.positions.has(key)) {
        a.states.push(c);
        a.positions.add(key);
      }
      return a;
    }, { states: [], positions: new Set() }));

    // use only best states
    states = states.sort(compareStates).slice(0, 100);
  }
}

const printStates = (states) => {
  const debug = states.map(s => s.me);
  states[0].print(debug);
}

const win = run();
win.print();
console.log(win.minute);
