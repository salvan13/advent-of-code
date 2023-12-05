export class Almanac {
  constructor(input) {
    this.seeds = [];
    this.maps = [];

    for (let i = 0; i < input.length; i++) {
      const row = input[i];
      if (row) {
        if (row.startsWith("seeds: ")) {
          this.seeds = row.replace("seeds: ", "").split(" ").map(n => parseInt(n));
        } else if (row.endsWith(" map:")) {
          const [from, to] = row.replace(" map:", "").split("-to-");
          this.maps.push({ from, to, ranges: [] });
        } else {
          this.maps.at(-1).ranges.push(new Range(row.split(" ").map(n => parseInt(n))));
        }
      }
    }
  }

  getLocation(val, start = "seed") {
    const map = this.maps.find(m => m.from === start);
    for (let i = 0; i < map.ranges.length; i++) {
      const range = map.ranges[i];
      const nv = range.map(val);
      if (Number.isFinite(nv)) {
        val = nv;
        break;
      }
    }
    if (map.to === "location") {
      return val;
    }
    return this.getLocation(val, map.to);
  }

  getLocations() {
    return this.seeds.map(seed => this.getLocation(seed));
  }
}

class Range {
  constructor(values) {
    this.dest = values[0];
    this.source = values[1];
    this.length = values[2];
  }

  map(value) {
    if (value >= this.source && value <= this.source + this.length - 1) {
      return this.dest + value - this.source;
    }
    return null;
  }
}
