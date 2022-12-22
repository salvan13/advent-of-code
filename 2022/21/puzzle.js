import { readInput } from "../utils.js";

const { lines } = await readInput({ sourceUrl: import.meta.url });

// part 1

const getCalcFn = lines => {
  const ops = new Set(lines.map(l => `let ${l.replace(":", " =")};`));
  let code = [];

  while (ops.size) {
    for (const line of ops.values()) {
      if (line.match(/let (.*) = (\d+);/)) {
        code.push(line);
        ops.delete(line);
      } else {
        const m = line.match(/let (.*) = (.*) [-*\/+] (.*);/);
        const findOp = m => Array.from(code).find(op => op.includes(`let ${m}`));
        if (findOp(m[2]) && findOp(m[3])) {
          code.push(line);
          ops.delete(line);
        }
      }
    }
  }

  return new Function(code.concat(["return root;"]).join("\n"));
};

console.log(getCalcFn(lines)());
