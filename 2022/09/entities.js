export class Point {
  x = 0;
  y = 0;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `x:${this.x},y:${this.y}`;
  }
}

export class Knot {
  positions = [new Point(0, 0)];

  move(dir) {
    const pos = this.positions.at(-1);

    let newX = pos.x;
    let newY = pos.y;

    switch (dir) {
      case "U":
        newY--;
        break;
      case "D":
        newY++;
        break;
      case "L":
        newX--;
        break;
      case "R":
        newX++;
        break;
    }

    this.positions.push(new Point(newX, newY));
  }

  follow(other) {
    const myPos = this.positions.at(-1);
    const otherPos = other.positions.at(-1);

    const diffX = otherPos.x - myPos.x;
    const diffY = otherPos.y - myPos.y;

    if (Math.abs(diffX) > 1 || Math.abs(diffY) > 1) {
      this.positions.push(new Point(myPos.x + Math.sign(diffX), myPos.y + Math.sign(diffY)));
    }
  }

  uniquePositions() {
    return new Set(this.positions.map(p => p.toString())).size;
  }
}
