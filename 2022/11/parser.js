export const parser = line => {
  line = line.trim();
  let r;

  r = line.match(/Monkey (\d+)/);
  if (r) {
    return { id: parseInt(r[1], 10) }
  }

  r = line.match(/Starting items: (.*)/);
  if (r) {
    return { items: r[1].split(",").map(v => parseInt(v.trim(), 10)) }
  }

  r = line.match(/Operation: (.*)/);
  if (r) {
    return { op: new Function("old", `${r[1].replace("new", "let newVal")}; return newVal;`) }
  }

  r = line.match(/Test: divisible by (\d+)/);
  if (r) {
    return { test: parseInt(r[1], 10) }
  }

  r = line.match(/If true: throw to monkey (\d+)/);
  if (r) {
    return { nextTrue: parseInt(r[1], 10) }
  }

  r = line.match(/If false: throw to monkey (\d+)/);
  if (r) {
    return { nextFalse: parseInt(r[1], 10) }
  }
};
