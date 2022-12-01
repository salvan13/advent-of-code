import { open } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const readInput = async ({ sourceUrl, fileName = "input.txt", parser = l => l }) => {
  const baseDir = dirname(fileURLToPath(sourceUrl));
  const file = await open(join(baseDir, fileName));

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
