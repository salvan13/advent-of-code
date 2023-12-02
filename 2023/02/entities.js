export class Game {
  constructor(data) {
    this.id = data.id;
    this.sets = data.sets;
  }

  isPossible(checks) {
    return this.sets.every(set => set.isPossible(checks));
  }

  getPower() {
    return this.getMinNeededGameSet().getPower();
  }

  getMinNeededGameSet() {
    const max = {};
    this.sets.forEach(set => {
      set.pairs.forEach(pair => {
        if (!max[pair.color] || pair.number > max[pair.color]) {
          max[pair.color] = pair.number;
        }
      });
    });
    const pairs = [];
    Object.keys(max).forEach(color => {
      pairs.push(new GamePair([max[color], color]));
    })
    return new GameSet(pairs);
  }
}

export class GameSet {
  constructor(pairs) {
    this.pairs = pairs;
  }

  isPossible(checks) {
    return this.pairs.every(pair => pair.isPossible(checks));
  }

  getPower() {
    return this.pairs.reduce((acc, pair) => {
      return acc * pair.number;
    }, 1);
  }
}

export class GamePair {
  constructor(data) {
    this.number = parseInt(data[0]);
    this.color = data[1];
  }

  isPossible(checks) {
    return this.number <= checks[this.color];
  }
}
