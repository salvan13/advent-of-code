export class Entity {
  constructor(pos) {
    this.pos = pos;
  }
}

export class Wall extends Entity {
}

export class Me extends Entity {
  availablePositions() {
    return [
      { ...this.pos, y: this.pos.y + 1 },
      { ...this.pos, x: this.pos.x + 1 },
      { ...this.pos },
      { ...this.pos, x: this.pos.x - 1 },
      { ...this.pos, y: this.pos.y - 1 }
    ];
  }
}

export class Blizzard extends Entity {
  constructor(pos, dir) {
    super(pos);
    this.dir = dir;
  }

  nextPos({ minX, minY, maxX, maxY }) {
    switch (this.dir) {
      case "<":
        return { ...this.pos, x: this.pos.x - 1 < minX ? maxX : this.pos.x - 1 };
      case ">":
        return { ...this.pos, x: this.pos.x + 1 > maxX ? minX : this.pos.x + 1 };
      case "v":
        return { ...this.pos, y: this.pos.y + 1 > maxY ? minY : this.pos.y + 1 };
      case "^":
        return { ...this.pos, y: this.pos.y - 1 < minY ? maxY : this.pos.y - 1 };
    }
  }
}

export class State {
  constructor(values) {
    this.walls = [];
    this.blizzards = [];
    this.me = null;
    this.minute = 0;

    for (const [y, row] of values.entries()) {
      for (const [x, cell] of row.entries()) {
        switch (cell) {
          case "#":
            this.walls.push(new Wall({ y, x }));
            break;
          case ".":
            if (!this.me) {
              this.me = new Me({ y, x });
            }
            break;
          case "<":
          case ">":
          case "v":
          case "^":
            this.blizzards.push(new Blizzard({ y, x }, cell));
            break;
        }
      }
    }
  }

  size() {
    return {
      minY: Math.min(...this.walls.map(w => w.pos.y)),
      minX: Math.min(...this.walls.map(w => w.pos.x)),
      maxY: Math.max(...this.walls.map(w => w.pos.y)),
      maxX: Math.max(...this.walls.map(w => w.pos.x))
    };
  }

  wallAt({ y, x }) {
    return this.walls.find(wall => wall.pos.x === x && wall.pos.y === y);
  }

  blizzardsAt({ y, x }) {
    return this.blizzards.filter(blizz => blizz.pos.x === x && blizz.pos.y === y);
  }

  over(goBack) {
    return goBack ? this.me.pos.y === this.size().minY : this.me.pos.y === this.size().maxY;
  }

  clone() {
    const clone = new State([]);
    clone.walls = this.walls;
    clone.minute = this.minute;
    clone.me = new Me({ y: this.me.pos.y, x: this.me.pos.x });
    clone.blizzards = this.blizzards.map(b => new Blizzard({ y: b.pos.y, x: b.pos.x }, b.dir));
    return clone;
  }

  print(debug = []) {
    const { minX, minY, maxX, maxY } = this.size();
    const map = Array.from({ length: maxY - minY + 1 }, (_, y) =>
      Array.from({ length: maxX - minX + 1 }, (_, x) => {
        if (this.me.pos.x === x && this.me.pos.y === y) {
          return "\x1b[41mE\x1b[0m";
        }
        if (debug.find(d => d.pos.x === x && d.pos.y === y)) {
          return "\x1b[41mE\x1b[0m";
        }
        const wall = this.wallAt({ y, x });
        const blizzs = this.blizzardsAt({ y, x });
        return wall ? "#" : (blizzs.length === 0 ? "." : (blizzs.length === 1 ? blizzs[0].dir : blizzs.length));
      })
    );
    console.log(map.map(row => row.join("")).join("\n") + "\n");
  }
}