import { readInput } from "../utils.js";
import { Node, Tree } from "./entities.js";

const parser = line => {
  let m = line.match(/([a-z]{4}): (\d+)/);
  if (m) {
    return new Node(m[1], { value: parseInt(m[2], 10) });
  } else {
    m = line.match(/([a-z]{4}): ([a-z]{4}) ([+-/*]) ([a-z]{4})/);
    return new Node(m[1], { left: m[2], op: m[3], right: m[4] });
  }
};

const { values: nodes } = await readInput({ sourceUrl: import.meta.url, parser });

// part 1

const tree = new Tree(nodes);

console.log(tree.calc("root"));

// part 2

tree.getNode("humn").value = NaN;
tree.getNode("root").op = "===";

let node = tree.getNode("root");
let val = NaN;

while (node.id !== "humn") {
  const leftNode = tree.getNode(node.left);
  const rightNode = tree.getNode(node.right);
  const leftVal = tree.calc(leftNode.id);
  const rightVal = tree.calc(rightNode.id);

  switch (node.op) {
    case "===":
      val = Number.isNaN(leftVal) ? rightVal : leftVal;
      break;
    case "+":
      val -= Number.isNaN(leftVal) ? rightVal : leftVal;
      break;
    case "-":
      val = Number.isNaN(leftVal) ? val + rightVal : -(val - leftVal);
      break;
    case "*":
      val /= Number.isNaN(leftVal) ? rightVal : leftVal;
      break;
    case "/":
      val = Number.isNaN(leftVal) ? rightVal * val : leftVal / val;
      break;
  }

  node = Number.isNaN(leftVal) ? leftNode : rightNode;
}

console.log(val);
tree.getNode("humn").value = val;
console.log(tree.calc("root"));
