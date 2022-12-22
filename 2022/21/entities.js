export class Node {
  constructor(id, { value, op, left, right }) {
    this.id = id
    this.value = value;
    this.op = op;
    this.left = left;
    this.right = right;
  }
}

export class Tree {
  constructor(nodes) {
    this.nodes = nodes.reduce((a, c) => {
      a[c.id] = c;
      return a;
    }, {});
  }

  getNode(id) {
    return this.nodes[id];
  }

  calc(id) {
    const node = this.getNode(id);
    if (Number.isFinite(node.value) || Number.isNaN(node.value)) {
      return node.value;
    } else {
      const fn = new Function("a", "b", `return a ${node.op} b;`);
      return fn(this.calc(node.left), this.calc(node.right));
    }
  }
}
