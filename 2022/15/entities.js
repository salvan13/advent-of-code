class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  dist(other) {
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
  }
}

export class Sensor {
  constructor(x, y, bx, by) {
    this.pos = new Point(x, y);
    this.beacon = new Point(bx, by);
  }

  dist() {
    return this.pos.dist(this.beacon);
  }

  row(y) {
    const d = this.dist();
    const p = new Point(this.pos.x, y).dist(this.pos);
    const diff = d - p;
    if (diff >= 0) {
      return {
        start: this.pos.x - diff,
        end: this.pos.x + diff
      };
    }
  }
}
