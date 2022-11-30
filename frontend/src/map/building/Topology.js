import Point from "../geom/Point";
import Graph from "../geom/Graph";

import ArrayUtils from "../utils/ArrayUtils";


export default class Topology {
  model; //: Model;

  graph; //: Graph;

  pt2node; //: Map<Point, Node>;
  node2pt; //: Map<Node, Point>;

  blocked; //: Array<Point>;

  inner; //: Array<Node>;
  outer; //: Array<Node>;

  constructor(model) {
    this.model = model;

    this.graph = new Graph();
    this.pt2node = new Map();
    this.node2pt = new Map();

    this.inner = [];
    this.outer = [];

    // Building a list of all blocked points (shore + walls excluding gates)
    this.blocked = [];
    if (this.model.citadel != null)
      this.blocked = this.blocked.concat(this.model.citadel.shape);
    if (this.model.wall != null)
      this.blocked = this.blocked.concat(this.model.wall.shape);
    this.blocked = ArrayUtils.difference(this.blocked, this.model.gates);

    let border = this.model.border.shape;

    this.model.patches.forEach((p) => {
      let withinCity = p.withinCity;

      let v1 = ArrayUtils.last(p.shape);
      let n1 = this.processPoint(v1);

      for (let i = 0; i < p.shape.length; i++) {
        let v0 = v1;
        v1 = p.shape[i];
        let n0 = n1;

        n1 = this.processPoint(v1);

        if (n0 != null && !border.includes(v0))
          if (withinCity) ArrayUtils.add(this.inner, n0);
          else ArrayUtils.add(this.outer, n0);
        if (n1 != null && !border.includes(v1))
          if (withinCity) ArrayUtils.add(this.inner, n1);
          else ArrayUtils.add(this.outer, n1);

        if (n0 != null && n1 != null) {
          n0.link(n1, Point.distance(v0, v1));
        }
      }
    });
  }

  processPoint(v) {
    let n;

    if (this.pt2node.has(v)) n = this.pt2node.get(v);
    else {
      n = this.graph.add();
      this.pt2node.set(v, n);
      this.node2pt.set(n, v);
    }

    return this.blocked.includes(v) ? null : n;
  }

  buildPath(from, to, exclude = null) {
    let path = this.graph.aStar(
      this.pt2node.get(from),
      this.pt2node.get(to),
      exclude
    );
    let points = [];
    let nodes = [];
    if (path === null) return null;
    path.forEach((n) => {
      points.push(this.node2pt.get(n));
      nodes.push(n);
    });
    return { points, nodes };
  }
}
