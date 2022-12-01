import { open } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const baseDir = dirname(fileURLToPath(import.meta.url));

export const readInput = async (day, fileName, parser = l => l) => {
  const file = await open(join(baseDir, String(day), fileName));

  const lines = [];
  const values = [];

  for await (const line of file.readLines()) {
    lines.push(line);
    values.push(parser(line));
  }

  return {
    lines,
    values
  };
};
