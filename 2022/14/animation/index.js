import { makeCave, fall } from "../cave.js";

const parser = line => {
  return line.split("->").map(p => p.trim().split(",").map(v => parseInt(v, 10)));
};

const values = (await (await fetch("../input.txt")).text()).split("\n").map(parser);

const c = makeCave(values);

const updates = [[]];

const main = document.createElement("main");

main.style.setProperty("--size", c.lastCol - c.firstCol);
document.body.appendChild(main);

const run = (c) => {
  const onStep = step => {
    updates.at(-1).push(step);
  };

  while (fall(c, { onStep })) {
    updates.push([]);
  }
}

const createEl = (type, { x, y }) => {
  const item = document.createElement("div");
  item.classList.add("item");
  item.classList.add(type);

  item.style.setProperty("--x", x);
  item.style.setProperty("--y", y);

  main.appendChild(item);

  return item;
}

Object.keys(c.cave).forEach((col, x) => {
  c.cave[col].forEach((cell, y) => {
    if (cell === "#") {
      const block = createEl("block", { x, y });
      block.style.zIndex = -y;
    }
    if (cell === "+") {
      createEl("start", { x, y });
    }
  });
});

run(c);

const animate = async () => {

  const wait = t => new Promise((res) => {
    setTimeout(() => {
      res();
    }, t);
  });

  const drop = async (steps, i) => {
    const sand = createEl("sand", { x: 500, y: 0 });
    i > 100 && (sand.style.transitionDuration = "0.05s");
    for (let j = 0; j < steps.length; j++) {
      const step = steps[j];
      sand.style.setProperty("--x", step[0] - c.firstCol);
      sand.style.setProperty("--y", step[1]);
      await wait(j < 100 ? (100 - j * 1) : 100);
    }
  }

  await wait(1000);
  main.style.animation = "viewport 100s forwards";

  for (let i = 0; i < updates.length; i++) {
    await wait(i < 100 ? (1000 - i * 10) : 100);
    drop(updates[i], i);
  }
};

animate();
