export class RotatingList {
  constructor(array) {
    this.nodes = array.reduce((a, c, i, d) => {
      a[i] = {
        id: i,
        value: c,
        next: i + 1 < d.length ? i + 1 : 0,
        prev: i == 0 ? d.length - 1 : i - 1
      };
      return a;
    }, {});

    this.size = array.length;
  }

  getNode(id, shift = 0) {
    let node = this.nodes[id];

    let mod = shift % this.size;

    if (mod) {
      if (mod > 0) {
        while (mod--) {
          node = this.nodes[node.next];
        }
      } else {
        while (mod++) {
          node = this.nodes[node.prev];
        }
      }
    }

    return node;
  }

  getNodeByValue(v, shift = 0) {
    return this.getNode(Object.keys(this.nodes).find(id => this.nodes[id].value === v), shift);
  }

  move(id, shift) {
    if (!shift) {
      return;
    }

    const node = this.getNode(id);
    const prevNode = this.getNode(node.prev);
    const nextNode = this.getNode(node.next);

    prevNode.next = nextNode.id;
    nextNode.prev = prevNode.id;

    const newPrev = this.getNode(prevNode.id, shift % (this.size - 1));
    const newNext = this.getNode(newPrev.next);

    newPrev.next = node.id;
    newNext.prev = node.id;

    node.next = newNext.id;
    node.prev = newPrev.id;
  }

  toString() {
    const str = [];
    const firstNode = this.getNode(Object.keys(this.nodes)[0]);
    let curr = null;

    while (curr !== firstNode.id) {
      const node = curr ? this.getNode(curr) : firstNode;
      str.push(node.value);
      curr = node.next;
    }

    return str.join(":");
  }
}
