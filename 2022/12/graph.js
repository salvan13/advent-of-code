import { WeightedGraph } from "./dijkstra.js";

export const makeGraph = values => {
  const graph = new WeightedGraph();

  const getNodeName = ({ v, y, x }) => {
    if (["S", "E"].includes(v)) return v;
    return `${y}:${x}:${v}`;
  };

  const getCost = (node) => {
    if (node.v === "S") return "a".charCodeAt(0) - 1;
    if (node.v === "E") return "z".charCodeAt(0) + 1;
    return node.v.charCodeAt(0);
  };

  const addNode = (node) => {
    graph.addVertex(node.name);
  };

  const getNextNodes = ({ x, y }) =>
    [{ x: x + 1, y }, { x: x - 1, y }, { x, y: y + 1 }, { x, y: y - 1 }].map(n => {
      if (values[n.y] && values[n.y][n.x]) {
        const name = getNodeName({ v: values[n.y][n.x], y: n.y, x: n.x });
        return { name, y: n.y, x: n.x, v: values[n.y][n.x] };
      }
    }).filter(n => !!n);

  for (let y = 0; y < values.length; y++) {
    const row = values[y];
    for (let x = 0; x < row.length; x++) {
      const val = row[x];
      const name = getNodeName({ v: val, y, x });
      const node = { name, y, x, v: val };
      addNode(node);
      const nodes = getNextNodes({ y, x });
      nodes.forEach(next => {
        addNode(next);
        const costNode = getCost(node);
        const costNext = getCost(next);
        if (costNext <= costNode + 1) {
          graph.addEdge(node.name, next.name, 1);
        }
      });
    }
  }

  return graph;
};
