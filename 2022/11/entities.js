export class Monkey {
  id = NaN
  items = []
  op = ""
  test = NaN
  nextTrue = NaN
  nextFalse = NaN
  inspects = 0
}

export const createMonkeyList = (values) =>
  values.reduce((a, c) => {
    if (c) {
      Object.keys(c).forEach(k => {
        a.at(-1)[k] = Array.isArray(c[k]) ? c[k].map(v => v) : c[k];
      });
    } else {
      a.push(new Monkey());
    }
    return a;
  }, [new Monkey()]);
