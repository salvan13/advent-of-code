import { sum } from "../utils.js";

const newDir = () => ({ files: [], size: 0, subdirs: {} });

export const makeFS = (terminal) => {
  const fs = newDir();
  const cwd = [];

  const getDir = (dir, make = false) => {
    if (dir.length === 1 && dir[0] === '/') {
      return fs;
    }
    let curr = fs;
    for (let i = 1; i < dir.length; i++) {
      const dirname = dir[i];
      if (!curr.subdirs[dirname]) {
        if (make) {
          curr.subdirs[dirname] = newDir();
        } else {
          throw new Error(`dir not found ${dir.join('/')}`);
        }
      }
      curr = curr.subdirs[dirname];
    }
    return curr;
  };

  const mkDir = (dir) => {
    return getDir(dir, true);
  };

  const addFile = (dir, file) => {
    getDir(dir).files.push(file);
    updateSize(dir);
  };

  const updateSize = (dir) => {
    if (!dir.length) {
      return;
    }
    const d = getDir(dir);
    const filesSize = sum(d.files.map(f => f.size));
    let dirsSize = 0;
    for (const sub in d.subdirs) {
      dirsSize += d.subdirs[sub].size;
    }
    d.size = filesSize + dirsSize;
    updateSize(dir.slice(0, dir.length - 1));
  };

  for (let i = 0; i < terminal.length; i++) {
    const cmd = terminal[i];

    if (cmd[0] === "$") {
      if (cmd[1] === "cd") {
        if (cmd[2] === "..") {
          cwd.pop();
        } else {
          cwd.push(cmd[2]);
        };
      }
    } else {
      if (cmd[0] === "dir") {
        mkDir(cwd.concat(cmd[1]));
      } else {
        addFile(cwd, { name: cmd[1], size: parseInt(cmd[0], 10) });
      }
    }
  }

  return fs;
};

export const dirFinder = (dir, cond) => {
  let results = [];

  if (cond(dir)) {
    results.push(dir);
  }

  for (const sub in dir.subdirs) {
    results = results.concat(dirFinder(dir.subdirs[sub], cond));
  }

  return results;
};
