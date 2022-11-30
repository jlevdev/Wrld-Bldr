import Point from "./Point";
import MathUtils from "../utils/MathUtils";

import ArrayUtils from "../utils/ArrayUtils";


export default class Voronoi {
  triangles; //Array<Triangle>;
  get regions() {
    if (this._regionsDirty) {
      this._regions = new Map();
      this._regionsDirty = false;
      this.points.forEach((p) => {
        this._regions.set(p, this.buildRegion(p));
      });
    }
    return this._regions;
  }

  _regionsDirty; //: Bool;
  _regions = new Map(); //: Map<Point, Region>;

  points; //: Array<Point>;
  frame; //: Array<Point>;

  constructor(minx, miny, maxx, maxy) {
    this.triangles = [];

    let c1 = new Point(minx, miny);
    let c2 = new Point(minx, maxy);
    let c3 = new Point(maxx, miny);
    let c4 = new Point(maxx, maxy);
    this.frame = [c1, c2, c3, c4];
    this.points = [c1, c2, c3, c4];
    this.triangles.push(new Triangle(c1, c2, c3));
    this.triangles.push(new Triangle(c2, c3, c4));

    // Maybe we shouldn't do it beause these temporary
    // regions will be discarded anyway
    this.points.forEach((p) => {
      this._regions.set(p, this.buildRegion(p));
    });
    this._regionsDirty = false;
  }

  /**
   * Adds a point to the list and updates the list of triangles
   * splits up triangles that intersect one another
   * @param p a point to add
   **/
  addPoint(p) {
    let toSplit = [];
    this.triangles.forEach((tr) => {
      if (Point.distance(p, tr.c) < tr.r) toSplit.push(tr);
    });

    if (toSplit.length > 0) {
      this.points.push(p);

      let a = [];
      let b = [];
      toSplit.forEach((t1) => {
        let e1 = true;
        let e2 = true;
        let e3 = true;
        for (let i = 0; i < toSplit.length; i++) {
          const t2 = toSplit[i];
          if (t2 != t1) {
            // If triangles have a common edge, it goes in opposite directions
            if (e1 && t2.hasEdge(t1.p2, t1.p1)) e1 = false;
            if (e2 && t2.hasEdge(t1.p3, t1.p2)) e2 = false;
            if (e3 && t2.hasEdge(t1.p1, t1.p3)) e3 = false;
            if (!(e1 || e2 || e3)) break;
          }
        }
        if (e1) {
          a.push(t1.p1);
          b.push(t1.p2);
        }
        if (e2) {
          a.push(t1.p2);
          b.push(t1.p3);
        }
        if (e3) {
          a.push(t1.p3);
          b.push(t1.p1);
        }
      });

      let index = 0;
      do {
        this.triangles.push(new Triangle(p, a[index], b[index]));
        index = a.indexOf(b[index]);
      } while (index != 0);

      toSplit.forEach((tr) => {
        ArrayUtils.remove(this.triangles, tr);
      });

      this._regionsDirty = true;
    }
  }

  buildRegion(p) {
    let r = new Region(p);
    this.triangles.forEach((tr) => {
      if (tr.p1 == p || tr.p2 == p || tr.p3 == p) r.vertices.push(tr);
    });

    return r.sortVertices();
  }

  /**
   * Checks if neither of a triangle's vertices is a frame point
   **/
  isReal(tr) {
    return !(
      this.frame.includes(tr.p1) ||
      this.frame.includes(tr.p2) ||
      this.frame.includes(tr.p3)
    );
  }

  /**
   * Returns triangles which do not contain "frame" points as their vertices
   * @return List of triangles
   **/
  triangulation() {
    return this.triangles.filter(this.isReal);
  }

  //gets all regions that are not part of the frame
  partioning() {
    // Iterating over points, not regions, to use points ordering
    let result = [];
    this.points.forEach((p) => {
      let r = this.regions.get(p);
      let isReal = true;
      for (let i = 0; i < r.vertices.length; i++) {
        const v = r.vertices[i];
        if (!this.isReal(v)) {
          isReal = false;
          break;
        }
      }

      if (isReal) result.push(r);
    });
    return result;
  }

  getNeighbours(r1) {
    const result = [];
    this.regions.forEach((r2) => {
      if (r1.borders(r2)) result.push(r2);
    });
    return result;
  }

  static relax(voronoi, toRelax = null) {
    //remove all frame related components
    let regions = voronoi.partioning();

    let points = voronoi.points.slice(0);
    voronoi.frame.forEach((p) => {
      ArrayUtils.remove(points, p);
    });

    if (toRelax == null) toRelax = voronoi.points;
    regions.forEach((r) => {
      if (toRelax.includes(r.seed)) {
        ArrayUtils.remove(points, r.seed);
        points.push(r.center());
      }
    });
    return Voronoi.build(points);
  }

  static build(vertices) {
    let minx = 1e10;
    let miny = 1e10;
    let maxx = -1e9;
    let maxy = -1e9;

    vertices.forEach((v) => {
      if (v.x < minx) minx = v.x;
      if (v.y < miny) miny = v.y;
      if (v.x > maxx) maxx = v.x;
      if (v.y > maxy) maxy = v.y;
    });

    let dx = (maxx - minx) * 0.5;
    let dy = (maxy - miny) * 0.5;

    let voronoi = new Voronoi(
      minx - dx / 2,
      miny - dy / 2,
      maxx + dx / 2,
      maxy + dy / 2
    );
    vertices.forEach((v) => {
      voronoi.addPoint(v);
    });

    return voronoi;
  }
}

class Triangle {
  p1;
  p2;
  p3;

  c;
  r;

  constructor(p1, p2, p3) {
    let s =
      (p2.x - p1.x) * (p2.y + p1.y) +
      (p3.x - p2.x) * (p3.y + p2.y) +
      (p1.x - p3.x) * (p1.y + p3.y);
    this.p1 = p1;
    // CCW
    this.p2 = s > 0 ? p2 : p3;
    this.p3 = s > 0 ? p3 : p2;

    let x1 = (p1.x + p2.x) / 2;
    let y1 = (p1.y + p2.y) / 2;
    let x2 = (p2.x + p3.x) / 2;
    let y2 = (p2.y + p3.y) / 2;

    let dx1 = p1.y - p2.y;
    let dy1 = p2.x - p1.x;
    let dx2 = p2.y - p3.y;
    let dy2 = p3.x - p2.x;

    let tg1 = dy1 / dx1;
    let t2 = (y1 - y2 - (x1 - x2) * tg1) / (dy2 - dx2 * tg1);

    this.c = new Point(x2 + dx2 * t2, y2 + dy2 * t2);

    this.r = Point.distance(this.c, p1);
  }

  hasEdge(a, b) {
    return (
      (this.p1 == a && this.p2 == b) ||
      (this.p2 == a && this.p3 == b) ||
      (this.p3 == a && this.p1 == b)
    );
  }
}

export class Region {
  seed; //point
  vertices; //array of triangles

  constructor(seed) {
    this.seed = seed;
    this.vertices = [];
  }

  sortVertices() {
    this.vertices.sort((v1, v2) => {
      let x1 = v1.c.x - this.seed.x;
      let y1 = v1.c.y - this.seed.y;
      let x2 = v2.c.x - this.seed.x;
      let y2 = v2.c.y - this.seed.y;

      if (x1 >= 0 && x2 < 0) return 1;
      if (x2 >= 0 && x1 < 0) return -1;
      if (x1 == 0 && x2 == 0) return y2 > y1 ? 1 : -1;

      return MathUtils.sign(x2 * y1 - x1 * y2);
    });
    return this;
  }

  center() {
    let c = new Point();
    this.vertices.forEach((v) => {
      c.addEq(v.c);
    });
    c.scaleEq(1 / this.vertices.length);
    return c;
  }

  borders(r) {
    let len1 = this.vertices.length;
    let len2 = r.vertices.length;
    for (let i = 0; i < len1; i++) {
      let j = r.vertices.indexOf(this.vertices[i]);
      if (j != -1)
        return (
          this.vertices[(i + 1) % len1] == r.vertices[(j + len2 - 1) % len2]
        );
    }
    return false;
  }

  compareAngles(v1, v2) {
    //	return MathUtils.sign( v1.c.subtract( this.seed ).atan() - v2.c.subtract( this.seed ).atan() );
    let x1 = v1.c.x - this.seed.x;
    let y1 = v1.c.y - this.seed.y;
    let x2 = v2.c.x - this.seed.x;
    let y2 = v2.c.y - this.seed.y;

    if (x1 >= 0 && x2 < 0) return 1;
    if (x2 >= 0 && x1 < 0) return -1;
    if (x1 == 0 && x2 == 0) return y2 > y1 ? 1 : -1;

    return MathUtils.sign(x2 * y1 - x1 * y2);
  }
}
