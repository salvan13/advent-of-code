import { randomUUID } from "node:crypto";

export class Elf {
  constructor(pos) {
    this.id = randomUUID();
    this.pos = pos;
    this.proposal = null;
    this.priorities = ["N", "S", "W", "E"];
  }

  adjacentPositions(side) {
    const positions = [];

    (!side || side === "N" || side === "W") && positions.push({ y: this.pos.y - 1, x: this.pos.x - 1 });
    (!side || side === "N") && positions.push({ y: this.pos.y - 1, x: this.pos.x });
    (!side || side === "N" || side === "E") && positions.push({ y: this.pos.y - 1, x: this.pos.x + 1 });
    (!side || side === "E") && positions.push({ y: this.pos.y, x: this.pos.x + 1 });
    (!side || side === "E" || side === "S") && positions.push({ y: this.pos.y + 1, x: this.pos.x + 1 });
    (!side || side === "S") && positions.push({ y: this.pos.y + 1, x: this.pos.x });
    (!side || side === "S" || side === "W") && positions.push({ y: this.pos.y + 1, x: this.pos.x - 1 });
    (!side || side === "W") && positions.push({ y: this.pos.y, x: this.pos.x - 1 });

    return positions;
  }

  move() {
    if (this.proposal) {
      this.pos = this.proposal;
    }
  }

  finalize() {
    this.proposal = null;
    this.priorities = [...this.priorities.slice(1), this.priorities.at(0)];
  }
}

export class Map {
  constructor(data) {
    this.elves = [];

    for (const [y, row] of data.entries()) {
      for (const [x, cell] of row.entries()) {
        if (cell === "#") {
          this.elves.push(new Elf({ y, x }));
        }
      }
    }
  }

  size() {
    return {
      minY: Math.min(...this.elves.map(elf => elf.pos.y)),
      minX: Math.min(...this.elves.map(elf => elf.pos.x)),
      maxY: Math.max(...this.elves.map(elf => elf.pos.y)),
      maxX: Math.max(...this.elves.map(elf => elf.pos.x))
    };
  }

  at({ y, x }, { checkProposal = false } = {}) {
    return this.elves.filter(elf =>
      (elf.pos.x === x && elf.pos.y === y) ||
      (checkProposal && elf.proposal && elf.proposal.x === x && elf.proposal.y === y)
    );
  }

  freeSpots() {
    const { minX, minY, maxX, maxY } = this.size();
    return ((maxX - minX + 1) * (maxY - minY + 1)) - this.elves.length;
  }

  print() {
    const { minX, minY, maxX, maxY } = this.size();
    const map = Array.from({ length: maxY - minY + 3 }, (_, y) =>
      Array.from({ length: maxX - minX + 3 }, (_, x) => {
        const elves = this.at({ y: y + minY - 1, x: x + minX - 1 });
        const proposals = this.at({ y: y + minY - 1, x: x + minX - 1 }, { checkProposal: true });
        return elves.length ? "#" : (proposals.length || ".")
      })
    );
    console.log(map.map(row => row.join("")).join("\n") + "\n");
  }
}
