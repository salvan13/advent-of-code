export class Card {
  constructor(id, winning, played) {
    this.id = id;
    this.winning = winning;
    this.played = played;
  }

  getMatchingNumbers() {
    return this.winning.filter(wn => this.played.includes(wn));
  }

  getPoints() {
    const matchingNumbers = this.getMatchingNumbers();
    return matchingNumbers.length === 0 ? 0 : 2 ** (matchingNumbers.length - 1);
  }

  clone() {
    return new Card(this.id, this.winning, this.played);
  }
}
