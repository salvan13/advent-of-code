import { Game, GamePair, GameSet } from "./entities.js";

export const parser = line => {
  const data = {
    id: null,
    sets: []
  };
  const res = line.match(/^Game (\d+): (.*)/);
  data.id = (parseInt(res[1]));
  data.sets = res[2].split(";").map(set => new GameSet(set.trim().split(",").map(n => new GamePair(n.trim().split(" ")))));
  return new Game(data);
};
