export class Grid {
  constructor(input) {
    this.rows = [];

    input.forEach((r, y) => {
      const row = [];
      r.forEach((c, x) => {
        const cell = {
          x,
          y,
          content: c,
          part: false
        };
        row.push(cell);
      });
      this.rows.push(row);
    });
  }

  checkParts() {
    for (let y = 0; y < this.rows.length; y++) {
      const row = this.rows[y];
      for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        if (Number.isFinite(parseInt(cell.content)) && this.hasAdjacentSymbol(cell)) {
          cell.part = true;
        }
      }
    }
  }

  hasAdjacentSymbol(cell) {
    for (let y = cell.y - 1; y <= cell.y + 1; y++) {
      const row = this.rows[y];
      if (row) {
        for (let x = cell.x - 1; x <= cell.x + 1; x++) {
          const adjCell = row[x];
          if (adjCell && (adjCell.x !== cell.x || adjCell.y !== cell.y) && adjCell.content !== "." && Number.isNaN(parseInt(adjCell.content))) {
            return true;
          }
        }
      }
    }
    return false;
  }

  sumParts() {
    let sum = 0;
    let current = "";
    let isPart = false;

    const flush = () => {
      if (current && isPart) {
        sum += parseInt(current);
      }
      current = "";
      isPart = false;
    }

    for (let y = 0; y < this.rows.length; y++) {
      const row = this.rows[y];
      for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        if (cell.part) {
          isPart = true;
        }
        if (Number.isFinite(parseInt(cell.content))) {
          current += cell.content;
        } else {
          flush();
        }
      }
      flush();
    }
    return sum;
  }

  sumGears() {
    let sum = 0;
    for (let y = 0; y < this.rows.length; y++) {
      const row = this.rows[y];
      for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        if (cell.content === "*") {
          const adjPartNumbers = this.getAdjacentPartNumbers(cell);
          if (adjPartNumbers.length === 2) {
            sum += adjPartNumbers[0] * adjPartNumbers[1];
          }
        }
      }
    }
    return sum;
  }

  getAdjacentPartNumbers(cell) {
    let partNumbers = [];

    const getPartNumber = (cell) => {
      const nums = [cell.content];
      let isPart = cell.part;

      for (let x = cell.x + 1; true; x++) {
        const c = this.rows[cell.y][x];
        if (c && Number.isFinite(parseInt(c.content))) {
          if (c.part) {
            isPart = true;
          }
          nums.push(c.content);
        } else {
          break;
        }
      }

      for (let x = cell.x - 1; true; x--) {
        const c = this.rows[cell.y][x];
        if (c && Number.isFinite(parseInt(c.content))) {
          if (c.part) {
            isPart = true;
          }
          nums.unshift(c.content);
        } else {
          break;
        }
      }

      if (isPart) {
        return parseInt(nums.join(""));
      }
    };

    for (let y = cell.y - 1; y <= cell.y + 1; y++) {
      const row = this.rows[y];
      if (row) {
        for (let x = cell.x - 1; x <= cell.x + 1; x++) {
          const adjCell = row[x];
          if (adjCell && Number.isFinite(parseInt(adjCell.content))) {
            const n = getPartNumber(adjCell);
            if (n && !partNumbers.includes(n)) {
              partNumbers.push(n);
            }
          }
        }
      }
    }
    return partNumbers;
  }
}