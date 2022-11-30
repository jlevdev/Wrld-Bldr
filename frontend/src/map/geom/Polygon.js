import { Rectangle } from "paper/dist/paper-full";

import Point from "./Point";

import MathUtils from "../utils/MathUtils";

import GeomUtils from "./GeomUtils";

export default class Polygon extends Array {
  static DELTA = 0.000001;
  drawShadows = true;
  fixed = false;
  fixedX = 1;
  fixedY = 1;

  status = 0;
  start = 0;
  stop = 0; //tangents for iterative convex hull
  xmin = 0;
  xmax = 0;
  ymin = 0;
  ymax = 0; //position of hull
  yxmax = 0; //y coord of xmax
  rectp = null;
  recth = 0;
  rectw = 0;
  changed = false;

  constructor(vertices = null) {
    super();
    if (!Array.isArray(vertices)) Object.assign(this, []);
    else Object.assign(this, vertices.slice(0));
  }

  set(p) {
    for (let i = 0; i < p.length; i++) this[i].set(p[i]);
  }

  onSegment(p, q, r) {
    if (
      (q[0] <= Math.max(p[0], r[0])) &
      (q[0] >= Math.min(p[0], r[0])) &
      (q[1] <= Math.max(p[1], r[1])) &
      (q[1] >= Math.min(p[1], r[1]))
    ) {
      return true;
    }

    return false;
  }

  ori(p, q, r) {
    val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);

    if (val == 0) return 0;
    if (val > 0) return 1;
    // Collinear
    else return 2; // Clock or counterclock
  }

  doIntersect(p1, q1, p2, q2) {
    // Find the four orientations needed for
    // general and special cases
    o1 = this.ori(p1, q1, p2);
    o2 = this.ori(p1, q1, q2);
    o3 = this.ori(p2, q2, p1);
    o4 = this.ori(p2, q2, q1);

    // General case
    if (o1 != o2 && o3 != o4) return true;

    // Special Cases
    // p1, q1 and p2 are colinear and
    // p2 lies on segment p1q1
    if (o1 == 0 && onSegment(p1, p2, q1)) return true;

    // p1, q1 and p2 are colinear and
    // q2 lies on segment p1q1
    if (o2 == 0 && onSegment(p1, q2, q1)) return true;

    // p2, q2 and p1 are colinear and
    // p1 lies on segment p2q2
    if (o3 == 0 && onSegment(p2, p1, q2)) return true;

    // p2, q2 and q1 are colinear and
    // q1 lies on segment p2q2
    if (o4 == 0 && onSegment(p2, q1, q2)) return true;

    return false;
  }

  get square() {
    let v1 = this[this.length - 1];
    let v2 = this[0];
    let s = v1.x * v2.y - v2.x * v1.y;
    for (let i = 1; i < this.length; i++) {
      v1 = v2;
      v2 = this[i];
      s += v1.x * v2.y - v2.x * v1.y;
    }
    return s * 0.5;
  }

  get perimeter() {
    let len = 0.0;
    this.forEdge(function (v0, v1) {
      len += Point.distance(v0, v1);
    });
    return len;
  }

  // for circle	= 1.00
  // for square	= 0.79
  // for triangle	= 0.60
  get compactness() {
    let p = this.perimeter;
    return (4 * Math.PI * this.square) / (p * p);
  }

  // Faster approximation of centroid
  get center() {
    let c = new Point();
    this.forEach((v) => {
      c.addEq(v);
    });
    c.scaleEq(1 / this.length);
    return c;
  }

  get centroid() {
    let x = 0.0;
    let y = 0.0;
    let a = 0.0;
    this.forEdge(function (v0, v1) {
      let f = GeomUtils.cross(v0.x, v0.y, v1.x, v1.y);
      a += f;
      x += (v0.x + v1.x) * f;
      y += (v0.y + v1.y) * f;
    });
    let s6 = 1 / (3 * a);
    return new Point(s6 * x, s6 * y);
  }

  get size() {
    let x = this[0].x;
    let y = this[0].y;
    for (let i = 1; i < this.length; i++) {
      const p = this[i];
      x = p.x - x;
      y = p.y - y;
    }

    return (x + y) / this.length;
  }

  contains(v) {
    return this.indexOf(v) != -1;
  }

  forEdge(f) {
    let len = this.length;
    for (let i = 0; i < len; i++) f(this[i], this[(i + 1) % len]);
  }

  // Similar to forEdge, but doesn't iterate over the v(n)-v(0)
  forSegment(f) {
    for (let i = 0; i < this.length - 1; i++) f(this[i], this[i + 1]);
  }

  offset(p) {
    let dx = p.x;
    let dy = p.y;
    this.forEach((v) => {
      v.offset(dx, dy);
    });
  }

  rotate(a) {
    let cosA = Math.cos(a);
    let sinA = Math.sin(a);
    this.forEach((v) => {
      let vx = v.x * cosA - v.y * sinA;
      let vy = v.y * cosA + v.x * sinA;
      v.setTo(vx, vy);
    });
  }

  isConvexVertexi(i) {
    let len = this.length;
    let v0 = this[(i + len - 1) % len];
    let v1 = this[i];
    let v2 = this[(i + 1) % len];
    return (
      GeomUtils.cross(v1.x - v0.x, v1.y - v0.y, v2.x - v1.x, v2.y - v1.y) > 0
    );
  }

  isConvexVertex(v1) {
    let v0 = this.prev(v1);
    let v2 = this.next(v1);
    return (
      GeomUtils.cross(v1.x - v0.x, v1.y - v0.y, v2.x - v1.x, v2.y - v1.y) > 0
    );
  }

  isConvex() {
    this.forEach((v) => {
      if (!this.isConvexVertex(v)) return false;
    });

    return true;
  }

  smoothVertexi(i, f = 1.0) {
    let v = this[i];
    let len = this.length;
    let prev = this[(i + len - 1) % len];
    let next = this[(i + 1) % len];
    let result = new Point(
      (prev.x + v.x * f + next.x) / (2 + f),
      (prev.y + v.y * f + next.y) / (2 + f)
    );
    return result;
  }

  smoothVertex(v, f = 1.0) {
    let prev = this.prev(v);
    let next = this.next(v);
    return new Point(
      prev.x + v.x * f + next.x,
      prev.y + v.y * f + next.y
    ).scale(1 / (2 + f));
  }

  // This function returns minimal distance from any of the vertices
  // to a point, not real distance from the polygon
  distance(p) {
    let v0 = this[0];
    let d = Point.distance(v0, p);
    for (let i = 1; i < this.length; i++) {
      let v1 = this[i];
      let d1 = Point.distance(v1, p);
      if (d1 < d) v0 = v1;
    }
    return d;
  }

  smoothVertexEq(f = 1.0) {
    let len = this.length;
    let v1 = this[len - 1];
    let v2 = this[0];
    let result = [];
    for (let i = 0; i < len; i++) {
      let v0 = v1;
      v1 = v2;
      v2 = this[(i + 1) % len];
      result.push(
        new Point(
          (v0.x + v1.x * f + v2.x) / (2 + f),
          (v0.y + v1.y * f + v2.y) / (2 + f)
        )
      );
    }
    return result;
  }

  filterShort(threshold) {
    let i = 1;
    let v0 = this[0];
    let v1 = this[1];
    let result = [v0];
    do {
      do {
        v1 = this[i++];
      } while (Point.distance(v0, v1) < threshold && i < this.length);
      result.push((v0 = v1));
    } while (i < this.length);

    return result;
  }

  // This function insets one edge defined by its first vertex.
  // It's not very relyable, but it usually works (better for convex
  // vertices than for concave ones). It doesn't change the number
  // of vertices.
  inset(p1, d) {
    let i1 = this.indexOf(p1);
    let i0 = i1 > 0 ? i1 - 1 : this.length - 1;
    let p0 = this[i0];
    let i2 = i1 < this.length - 1 ? i1 + 1 : 0;
    let p2 = this[i2];
    let i3 = i2 < this.length - 1 ? i2 + 1 : 0;
    let p3 = this[i3];

    let v0 = p1.subtract(p0);
    let v1 = p2.subtract(p1);
    let v2 = p3.subtract(p2);

    let cos = v0.dot(v1) / v0.length / v1.length;
    let z = v0.x * v1.y - v0.y * v1.x;
    let t = d / Math.sqrt(1 - cos * cos); // sin( acos( cos ) )
    if (z > 0) {
      t = Math.min(t, v0.length * 0.99);
    } else {
      t = Math.min(t, v1.length * 0.5);
    }
    t *= MathUtils.sign(z);
    this[i1] = p1.subtract(v0.norm(t));

    cos = v1.dot(v2) / v1.length / v2.length;
    z = v1.x * v2.y - v1.y * v2.x;
    t = d / Math.sqrt(1 - cos * cos);
    if (z > 0) {
      t = Math.min(t, v2.length * 0.99);
    } else {
      t = Math.min(t, v1.length * 0.5);
    }
    this[i2] = p2.add(v2.norm(t));
  }

  insetAll(d) {
    let p = new Polygon(this);
    for (let i = 0; i < p.length; i++) {
      if (d[i] != 0) {
        p.inset(p[i], d[i]);
      }
    }
    return p;
  }

  // This function insets all edges by the same distance
  insetEq(d) {
    for (let i = 0; i < this.length; i++) {
      this.inset(this[i], d);
    }
  }

  // This function insets all edges by distances defined in an array.
  // It's kind of reliable for both convex and concave vertices, but only
  // if all distances are equal. Otherwise weird "steps" are created.
  // It does change the number of vertices.
  buffer(d) {
    // Creating a polygon (probably invalid) with offset edges
    let q = new Polygon();
    let i = 0;
    let n = null;
    this.forEdge(function (v0, v1) {
      let dd = d[i++];
      if (dd == 0) {
        q.push(v0);
        q.push(v1);
      } else {
        // here we may want to do something fancier for nicer joints
        let v = v1.subtract(v0);
        n = v.rotate90().norm(dd);
        q.push(v0.add(n));
        q.push(v1.add(n));
      }
    });

    // Creating a valid polygon by dealing with self-intersection:
    // we need to find intersections of every edge with every other edge
    // and add intersection point (twice - for one edge and for the other)
    let wasCut;
    let lastEdge = 0;
    do {
      wasCut = false;

      let n = q.length;
      for (let i = lastEdge; i < n - 2; i++) {
        lastEdge = i;

        let p11 = q[i];
        let p12 = q[i + 1];
        let x1 = p11.x;
        let y1 = p11.y;
        let dx1 = p12.x - x1;
        let dy1 = p12.y - y1;

        for (let j = i + 2; j < (i > 0 ? n : n - 1); j++) {
          let p21 = q[j];
          let p22 = j < n - 1 ? q[j + 1] : q[0];
          let x2 = p21.x;
          let y2 = p21.y;
          let dx2 = p22.x - x2;
          let dy2 = p22.y - y2;

          let int = GeomUtils.intersectLines(
            x1,
            y1,
            dx1,
            dy1,
            x2,
            y2,
            dx2,
            dy2
          );
          if (
            int != null &&
            int.x > Polygon.DELTA &&
            int.x < 1 - Polygon.DELTA &&
            int.y > Polygon.DELTA &&
            int.y < 1 - Polygon.DELTA
          ) {
            let pn = new Point(x1 + dx1 * int.x, y1 + dy1 * int.x);

            q.insert(j + 1, pn);
            q.insert(i + 1, pn);

            wasCut = true;
            break;
          }
        }
        if (wasCut) break;
      }
    } while (wasCut);

    // Checking every part of the polygon to pick the biggest
    let regular = [];
    for (let i = 0; i < q.length; i++) regular.push(i);

    let bestPart = null;
    let bestPartSq = Number.NEGATIVE_INFINITY;

    while (regular.length > 0) {
      let indices = [];
      let start = regular[0];
      let i = start;
      do {
        indices.push(i);
        regular.remove(i);

        let next = (i + 1) % q.length;
        let v = q[next];
        let next1 = q.indexOf(v);
        if (next1 == next) next1 = q.lastIndexOf(v);
        i = next1 == -1 ? next : next1;
      } while (i != start);

      let p = [];
      indices.forEach((i) => {
        p.push(q[i]);
      });
      let s = p.square;
      if (s > bestPartSq) {
        bestPart = p;
        bestPartSq = s;
      }
    }

    return bestPart;
  }

  // Another version of "buffer" function for insetting all edges
  // by the same distance (it's the best use of that function anyway)
  bufferEq(d) {
    let a = [];
    this.forEach((vv) => {
      return this.buffer(a);
    });
  }

  // This function insets all edges by distances defined in an array.
  // It can't outset a polygon. Works very well for convex polygons,
  // not so much concaqve ones. It produces a convex polygon.
  // It does change the number vertices
  shrink(d) {
    let q = new Polygon(this);
    let i = 0;
    this.forEdge(function (v1, v2) {
      let dd = d[i++];
      if (dd > 0) {
        let v = v2.subtract(v1);
        let n = v.rotate90().norm(dd);
        q = q.cut(v1.add(n), v2.add(n), 0)[0];
      }
    });
    return q;
  }

  shrinkEq(d) {
    let result = [];
    this.forEach((v) => {
      result.push(d);
    });
    return this.shrink(result);
  }

  // A version of "shrink" function for insetting just one edge.
  // It effectively cuts a peel along the edge.
  peel(v1, d) {
    let i1 = this.indexOf(v1);
    let i2 = i1 == this.length - 1 ? 0 : i1 + 1;
    let v2 = this[i2];

    let v = v2.subtract(v1);
    let n = v.rotate90().norm(d);

    return this.cut(v1.add(n), v2.add(n), 0)[0];
  }

  // Simplifies the polygons leaving only n vertices
  simplyfy(n) {
    let len = this.length;
    while (len > n) {
      let result = 0;
      let min = Number.POSITIVE_INFINITY;

      let b = this[len - 1];
      let c = this[0];
      for (let i = 0; i < len; i++) {
        let a = b;
        b = c;
        c = this[(i + 1) % len];
        let measure = Math.abs(
          a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)
        );
        if (measure < min) {
          result = i;
          min = measure;
        }
      }

      this.splice(result, 1);
      len--;
    }
  }

  //b must be the edge that comes after a
  findEdge(a, b) {
    let index = this.indexOf(a);
    return index != -1 && this[(index + 1) % this.length] == b ? index : -1;
  }

  next(a) {
    return this[(this.indexOf(a) + 1) % this.length];
  }

  prev(a) {
    return this[(this.indexOf(a) + this.length - 1) % this.length];
  }

  vector(v) {
    return this.next(v).subtract(v);
  }

  vectori(i) {
    return this[i == this.length - 1 ? 0 : i + 1].subtract(this[i]);
  }

  borders(another) {
    let len1 = this.length;
    let len2 = another.length;
    for (let i = 0; i < len1; i++) {
      let j = another.indexOf(this[i]);
      if (j != -1) {
        let next = this[(i + 1) % len1];
        // If this cause is not true, then should return false,
        // but it doesn't work for some reason
        if (
          next == another[(j + 1) % len2] ||
          next == another[(j + len2 - 1) % len2]
        )
          return true;
      }
    }
    return false;
  }

  getBounds() {
    let rect = new Rectangle(this[0].x, this[0].y);
    this.forEach((v) => {
      rect.left = Math.min(rect.left, v.x);
      rect.right = Math.max(rect.right, v.x);
      rect.top = Math.min(rect.top, v.y);
      rect.bottom = Math.max(rect.bottom, v.y);
    });
    return rect;
  }

  split(p1, p2) {
    return spliti(this.indexOf(p1), this.indexOf(p2));
  }

  spliti(i1, i2) {
    if (i1 > i2) {
      let t = i1;
      i1 = i2;
      i2 = t;
    }

    return [
      new Polygon(this.slice(i1, i2 + 1)),
      new Polygon(this.slice(i2).concat(this.slice(0, i1 + 1))),
    ];
  }

  cut(p1, p2, gap = 0) {
    let x1 = p1.x;
    let y1 = p1.y;
    let dx1 = p2.x - x1;
    let dy1 = p2.y - y1;

    let len = this.length;
    let edge1 = 0,
      ratio1 = 0.0;
    let edge2 = 0,
      ratio2 = 0.0;
    let count = 0;

    for (let i = 0; i < len; i++) {
      let v0 = this[i];
      let v1 = this[(i + 1) % len];

      let x2 = v0.x;
      let y2 = v0.y;
      let dx2 = v1.x - x2;
      let dy2 = v1.y - y2;

      //the point at which these lines intersect
      let t = GeomUtils.intersectLines(x1, y1, dx1, dy1, x2, y2, dx2, dy2);
      //null meaning the lines do not intersect
      if (t != null && t.y >= 0 && t.y <= 1) {
        switch (count) {
          case 0:
            edge1 = i;
            ratio1 = t.x;
          case 1:
            edge2 = i;
            ratio2 = t.x;
        }
        count++;
      }
    }

    if (count == 2) {
      let point1 = p1.add(p2.subtract(p1).scale(ratio1));
      let point2 = p1.add(p2.subtract(p1).scale(ratio2));

      let half1 = new Polygon(this.slice(edge1 + 1, edge2 + 1));
      half1.unshift(point1);
      half1.push(point2);

      let half2 = new Polygon(
        this.slice(edge2 + 1).concat(this.slice(0, edge1 + 1))
      );
      half2.unshift(point2);
      half2.push(point1);

      if (gap > 0) {
        half1 = half1.peel(point2, gap / 2);
        half2 = half2.peel(point1, gap / 2);
      }

      let v = this.vectori(edge1);
      return GeomUtils.cross(dx1, dy1, v.x, v.y) > 0
        ? [half1, half2]
        : [half2, half1];
    } else {
      return [new Polygon(this)];
    }
  }

  interpolate(p) {
    let sum = 0.0;
    let dd = [];
    this.forEach((v) => {
      let d = 1 / Point.distance(v, p);
      sum += d;
      dd.push(d);
    });
    let result = [];
    dd.forEach((d) => {
      result.push(d / sum);
    });
    return result;
  }

  static rect(w = 1.0, h = 1.0) {
    return new Polygon([
      new Point(-w / 2, -h / 2),
      new Point(w / 2, -h / 2),
      new Point(w / 2, h / 2),
      new Point(-w / 2, h / 2),
      new Point(-w / 2, -h / 2),
    ]);
  }

  static regular(n = 8, r = 1.0) {
    let result = [];
    for (let i = 0; i < n + 1; i++) {
      let a = (i / n) * Math.PI * 2;
      result.push(new Point(r * Math.cos(a), r * Math.sin(a)));
    }
    return new Polygon(result);
  }

  static circle(r = 1.0) {
    return this.regular(16, r);
  }

  area() {
    let area = 0;
    let n = this.length;
    let j = n - 1;

    for (let i = 0; i < this.length; i++) {
      area += (this[j].x + this[i].x) * (this[j].y - this[i].y);
      j = i;
    }

    return Math.abs(area / 2);
  }

  extent(valueof) {
    const values = this;
    let min;
    let max;
    if (valueof === undefined) {
      for (const value of values) {
        if (value != null) {
          if (min === undefined) {
            if (value >= value) min = max = value;
          } else {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    } else {
      let index = -1;
      for (let value of values) {
        if ((value = valueof(value, ++index, values)) != null) {
          if (min === undefined) {
            if (value >= value) min = max = value;
          } else {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
    return [min, max];
  }

  // Checks whether the point p is inside a polygon using the Ray-Casting algorithm
  // Implementation from: http://rosettacode.org/wiki/Ray-casting_algorithm//CoffeeScript
  pointInPoly(p) {
    let n = this.length;
    let b = this[n - 1];
    let c = 0;
    for (let i = 0; i < this.length; i++) {
      let a = b;
      b = this[i];
      if (Polygon.rayIntersectsSegment(p, a, b)) {
        c++;
      }
    }
    return c % 2 !== 0;
  }

  // Checks whether the horizontal ray going through point p intersects the segment p1p2
  // Implementation from: http://rosettacode.org/wiki/Ray-casting_algorithm//CoffeeScript
  static rayIntersectsSegment(p, p1, p2) {
    var [a, b] = p1.y < p2.y ? [p1, p2] : [p2, p1];
    if (p.y === b.y || p.y === a.y) p.y += Number.MIN_VALUE;
    if (p.y > b.y || p.y < a.y) return false;
    if (p.x > a.x && p.x > b.x) return false;
    if (p.x < a.x && p.x < b.x) return true;

    let mAB = (b.y - a.y) / (b.x - a.x);
    let mAP = (p.y - a.y) / (p.x - a.x);
    return mAP > mAB;
  }

  // Rotates the polygon for alpha radians around the origin
  static rotatePoly(poly, alpha, origin) {
    let newPoly = new Polygon();
    for (let i = 0; i < poly.length; i++) {
      const point = poly[i];
      newPoly.push(Polygon.rotatePoint(point, alpha, origin));
    }
    return newPoly;
  }

  // Rotates the point p for alpha radians around the origin
  static rotatePoint(p, alpha, origin = null) {
    origin = origin == null ? new Point(0, 0) : origin;
    let xshifted = p.x - origin.x;
    let yshifted = p.y - origin.y;
    let cosAlpha = Math.cos(alpha);
    let sinAlpha = Math.sin(alpha);
    return new Point(
      cosAlpha * xshifted - sinAlpha * yshifted + origin.x,
      sinAlpha * xshifted + cosAlpha * yshifted + origin.y
    );
  }
}
