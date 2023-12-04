import { Card } from "./entities.js";

export const parser = line => {
  const res = line.match(/^Card(\s+)(\d+): (.*)/);
  const id = (parseInt(res[2]));
  const res2 = res[3].split("|");
  const winning = res2[0].trim().split(" ").filter(n => !!n).map(n => parseInt(n));
  const played = res2[1].trim().split(" ").filter(n => !!n).map(n => parseInt(n));
  return new Card(id, winning, played);
};
