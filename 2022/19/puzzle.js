import { readInput, sum } from "../utils.js";

const parser = line => {
  const m = line.match(/\d+/g).map(n => parseInt(n, 10));
  return {
    id: m[0],
    ore: {
      ore: m[1]
    },
    clay: {
      ore: m[2]
    },
    obsidian: {
      ore: m[3],
      clay: m[4]
    },
    geode: {
      ore: m[5],
      obsidian: m[6]
    },
  };
};

const { values: blueprints } = await readInput({ sourceUrl: import.meta.url, parser });

// part 1

const types = ["ore", "clay", "obsidian", "geode"];

const copy = state => ({
  ...state,
  materials: { ...state.materials },
  robots: { ...state.robots },
  history: [...state.history]
});

const run = ({ minutes: maxMinutes, bp, maxStates }) => {
  const state = {
    materials: {
      ore: 0,
      clay: 0,
      obsidian: 0,
      geode: 0
    },
    robots: {
      ore: 1,
      clay: 0,
      obsidian: 0,
      geode: 0
    },
    minute: 1,
    factory: null,
    history: []
  };

  let states = [state];

  const step = (state) => {
    state.history.push(`minute ${state.minute}`);

    if (state.minute === maxMinutes + 1) {
      state.history.push("time over");
      return state;
    }

    const canBuildRobot = type => {
      const needs = Object.keys(bp[type]);
      for (const mat of needs) {
        if (state.materials[mat] < bp[type][mat]) {
          return false;
        }
      }
      return true;
    };

    const shouldBuildRobot = type => {
      const max = {
        ore: Math.max(bp.geode.ore + bp.obsidian.ore + bp.clay.ore + bp.ore.ore),
        clay: bp.obsidian.clay,
        obsidian: bp.geode.obsidian,
        geode: Infinity
      };

      return state.robots[type] < max[type];
    };

    const findRobotToBuild = () => {
      const newTypes = [];

      if (canBuildRobot("geode")) {
        return ["geode"];
      }

      for (const type of types) {
        canBuildRobot(type) && shouldBuildRobot(type) && newTypes.push(type);
      }

      return newTypes.concat([null]);
    };

    if (state.factory) {
      state.robots[state.factory]++;
      state.history.push(`build finished: robot ${state.factory}`);
      state.factory = null;
    }

    const possibilities = findRobotToBuild();

    for (let p = 0; p < possibilities.length; p++) {
      const newRobot = possibilities[p];

      const newState = copy(state);

      newState.factory = newRobot;

      if (newState.factory) {
        const type = newState.factory;
        const needs = Object.keys(bp[type]);
        for (const mat of needs) {
          newState.materials[mat] -= bp[type][mat];
        }
        newState.history.push(`build started: robot ${type}`);
      }

      for (const type of types) {
        const n = newState.robots[type];
        newState.materials[type] += n;
      }
      newState.history.push(`mats ${JSON.stringify(newState.materials)}`);

      states.push({ ...newState, minute: state.minute + 1 });
    }
  };

  const results = [];

  const stateScore = state => (state.robots.geode + (state.factory === "geode" ? 1 : 0)) * 1_000_000_000 + state.materials.geode * 100_000_000 +
    (state.robots.obsidian + (state.factory === "obsidian" ? 1 : 0)) * 1_000_000 + state.materials.obsidian * 100_000 +
    (state.robots.clay + (state.factory === "clay" ? 1 : 0)) * 1_000 + state.materials.clay * 100 +
    (state.robots.ore + (state.factory === "ore" ? 1 : 0)) * 10 + state.materials.ore;
  const compareStates = (a, b) => stateScore(b) - stateScore(a);

  while (states.length) {
    const minMinute = Math.min(...states.map(s => s.minute));
    console.log(minMinute, states.length);
    const statesToExecute = states.filter(s => s.minute === minMinute);
    for (let s = 0; s < statesToExecute.length; s++) {
      const state = statesToExecute[s];
      const res = step(state);
      if (res) {
        results.push(res);
      }
    }

    states = states.filter(s => s.minute > minMinute).sort(compareStates).slice(0, maxStates);
  }

  return results.sort(compareStates).sort((a, b) => b.materials.geode - a.materials.geode).at(0);
};

const results = blueprints.map(bp => {
  console.log("started", bp.id);
  const result = run({ minutes: 24, bp, maxStates: 50 });
  console.log("END", bp.id, result);
  return { result, bp };
});

console.log(sum(results.map(r => r.result.materials.geode * r.bp.id)));

// part 2

console.log(blueprints.slice(0, 3).map(bp => {
  console.log("started", bp.id);
  const result = run({ minutes: 32, bp, maxStates: 60_000 });
  console.log("END", bp.id, result);
  return { result, bp };
}).reduce((a, c) => a * c.result.materials.geode, 1));
