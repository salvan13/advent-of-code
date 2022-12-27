export default class SNAFU {
  constructor(string) {
    this.digits = string.split("");
  }

  toNumber() {
    const digit = d => ({
      "=": -2,
      "-": -1,
      "0": 0,
      "1": 1,
      "2": 2
    })[d];

    return [...this.digits].reverse().map((d, i) => 5 ** i * digit(d)).reduce((a, c) => a + c, 0);
  }

  toString() {
    return this.digits.join("");
  }

  static fromNumber(n) {
    const v = [];
    const digit = d => ({
      0: "0",
      1: "1",
      2: "2",
      3: "=",
      4: "-"
    })[d];

    while (n > 0) {
      const m = n % 5;
      n = Math.floor(n / 5) + (m >= 3 ? 1 : 0);
      v.push(digit(m));
    }

    return new SNAFU(v.reverse().join(""));
  }
}
