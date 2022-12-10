import { readInput, sum } from "../utils.js";

const parser = line => {
  const parts = line.split(' ');
  return {
    op: parts[0],
    value: parseInt(parts[1], 10)
  }
};

const { values: instructions } = await readInput({ sourceUrl: import.meta.url, parser });

// part 1

const run = ({ ops, str, crt }) => {
  const strengths = [];
  const pixels = Array.from({ length: crt.rows }, () => Array.from({ length: crt.size }).fill("."));

  let registerX = 1;
  let cycle = 0;

  const tick = () => {
    // CRT
    const row = Math.floor(cycle / crt.size);
    const pos = cycle % crt.size;
    const pixel = Array.from({ length: crt.pixels }, (_, i) => row * crt.size + i + registerX - Math.floor(crt.pixels / 2));
    if (pixel.includes(cycle)) {
      pixels[row][pos] = "#";
    }

    cycle++;

    // Stength
    if (cycle === str.start || (cycle - str.start) % str.step === 0) {
      strengths.push(registerX * cycle);
    }
  };

  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];

    Array.from({ length: ops[instruction.op] }).forEach(tick);

    if (instruction.op === "addx") {
      registerX += instruction.value;
    }
  }

  return {
    strengths,
    pixels
  };
};

const config = {
  ops: { noop: 1, addx: 2 },
  str: { start: 20, step: 40 },
  crt: { pixels: 3, size: 40, rows: 6 }
};

const execution = run(config);

console.log(sum(execution.strengths));

// part 2

console.log(execution.pixels.map(r => r.join("")));
