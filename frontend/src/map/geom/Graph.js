import ArrayUtils from "../utils/ArrayUtils";


export default class Graph {
  nodes = []; //: Array<Node> = [];

  add(node = null) {
    if (node == null) {
      node = new Node();
    }
    this.nodes.push(node);
    return node;
  }

  remove(node) {
    node.unlinkAll();
    ArrayUtils.remove(this.nodes, node);
  }

  aStar(start, goal, exclude = null) {
    let closedSet = exclude != null ? exclude.slice(0) : [];
    let openSet = [start];
    let cameFrom = new Map();

    let gScore = new Map();
    gScore.set(start, 0);

    while (openSet.length > 0) {
      let current = openSet.shift();

      if (current == goal) return this.buildPath(cameFrom, current);

      ArrayUtils.remove(openSet, current);
      closedSet.push(current);

      let curScore = gScore.get(current);

      current.links.forEach((price, neighbour) => {
        if (closedSet.includes(neighbour)) return;

        let score = curScore + price;
        if (!openSet.includes(neighbour)) openSet.push(neighbour);
        else if (score >= gScore.get(neighbour)) return;

        cameFrom.set(neighbour, current);
        gScore.set(neighbour, score);
      });
    }
    return null;
  }

  buildPath(cameFrom, current) {
    let path = [current];

    while (cameFrom.has(current)) path.push((current = cameFrom.get(current)));

    return path;
  }

  calculatePrice(path) {
    if (path.length < 2) {
      return 0;
    }

    let price = 0.0;
    let current = path[0];
    let next = path[1];
    for (let i = 0; i < path.length - 1; i++) {
      if (current.links.has(next)) {
        price += current.links.get(next);
      } else {
        return Number.NaN;
      }
      current = next;
      next = path[i + 1];
    }
    return price;
  }
}

class Node {
  classLabel = "Node";

  constructor() {
    this.links = new Map();
  }

  link(node, price = 1, symmetrical = true) {
    this.links.set(node, price);
    if (symmetrical) {
      node.links.set(this, price);
    }
  }

  unlink(node, symmetrical = true) {
    ArrayUtils.remove(this.links, node);
    if (symmetrical) {
      ArrayUtils.remove(node.links, this);
    }
  }

  unlinkAll() {
    for (node in this.links.keys()) {
      this.unlink(node);
    }
  }
}
