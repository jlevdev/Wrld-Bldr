import Cutter from "../building/Cutter";
import GeomUtils from "../geom/GeomUtils";
import Point from "../geom/Point";
import ArrayUtils from "../utils/ArrayUtils";
import Random from "../utils/Random";

import Polygon from "../geom/Polygon";

export default class Ward {
  static ADMINISTRATION_WARD = "Administration";
  static CASTLE_WARD = "Castle";
  static CATHEDRAL_WARD = "Temple";
  static CRAFTSMEN_WARD = "Craftsmen";
  static FARM_WARD = "Farm";
  static GATE_WARD = "Gate";
  static MARKET_WARD = "Market";
  static MERCHANT_WARD = "Merchant";
  static MILITARY_WARD = "Military";
  static PARK_WARD = "Park";
  static PATRICIATE_WARD = "Patriciate";
  static SLUM_WARD = "Slum";

  static MAIN_STREET = 2.0;
  static REGULAR_STREET = 3.0;
  static ALLEY = 5.0;

  static shopWards = [
    Ward.CRAFTSMEN_WARD,
    Ward.MERCHANT_WARD,
    Ward.GATE_WARD,
    Ward.SLUM_WARD,
    Ward.ADMINISTRATION_WARD,
  ];

  static sceneryWards = [
    Ward.MILITARY_WARD,
    Ward.PATRICIATE_WARD,
    Ward.FARM_WARD,
  ];

  model;
  patch;
  geometry;

  constructor(model, patch) {
    this.model = model;
    this.patch = patch;
  }

  static createAlleys(
    p,
    minSq,
    gridChaos,
    sizeChaos,
    emptyProb = 0.04,
    split = true
  ) {
    return [p]; //temporary
    // Looking for the longest edge to cut it
    let v = null;
    let length = -1.0;
    p.forEdge(function (p0, p1) {
      let len = Point.distance(p0, p1);
      if (len > length) {
        length = len;
        v = p0;
      }
    });

    let spread = 1.8 * gridChaos;
    sizeChaos = 3; //I did this?
    let ratio = (1 - spread) / 2 + Random.float() * spread;

    // Trying to keep buildings rectangular even in chaotic wards
    let angleSpread =
      (Math.PI / 6) * gridChaos * (p.square < minSq * 4 ? 0.0 : 1);
    let b = (Random.float() - 0.5) * angleSpread;

    //TODO: it looks like he keeps gap consistent but with a stroke. 1 or 0. Need to add stroke to make it look better.
    //It seems like there isn't a stroke for all alleys because some polygons don't enclose themselves therefore not
    //drawing a stroke on all sides?
    //gap determines the width of the alley between buildings
    //gap is the last arg here
    let halves = Cutter.bisect(p, v, ratio, b, 1);

    let buildings = [];
    halves.forEach((half) => {
      //if this is too small let's just stop here, or if it's big but we randomly want a pretty big building let's stop
      if (
        half.square <
        minSq * Math.pow(2, 4 * sizeChaos * (Random.float() - 0.2))
      ) {
        if (!Random.bool(emptyProb)) buildings.push(half);
      } else {
        //if this is pretty big let's keep going
        buildings = buildings.concat(
          Ward.createAlleys(
            half,
            minSq,
            gridChaos,
            sizeChaos,
            emptyProb,
            half.square > minSq / (Random.float() * Random.float())
          )
        );
      }
    });

    //return [p];

    return buildings;
  }

  static createOrthoBuilding(poly, minBlockSq, fill) {
    let that = this;
    function slice(poly, c1, c2) {
      let v0 = that.findLongestEdge(poly);
      let v1 = poly.next(v0);
      let v = v1.subtract(v0);

      let ratio = 0.4 + Random.float() * 0.2;
      let p1 = GeomUtils.interpolate(v0, v1, ratio);

      let c = null;
      if (
        Math.abs(GeomUtils.scalar(v.x, v.y, c1.x, c1.y)) <
        Math.abs(GeomUtils.scalar(v.x, v.y, c2.x, c2.y))
      )
        c = c1;
      else c = c2;

      let halves = poly.cut(p1, p1.add(c));
      let buildings = [];
      halves.forEach((half) => {
        if (half.square < minBlockSq * Math.pow(2, Random.normal() * 2 - 1)) {
          if (Random.bool(fill)) buildings.push(half);
        } else {
          buildings = buildings.concat(slice(half, c1, c2));
        }
      });
      return buildings;
    }
    let c = poly.center;
    let maxD = 0;
    let minD = Number.POSITIVE_INFINITY;
    poly.forEach((v) => {
      const dist = c.getDistance(v);
      maxD = dist > maxD ? dist : maxD;
      minD = dist < minD ? dist : minD;
    });

    minD = minD - minD / 5;

    let building = Polygon.rect(minD, minD);
    building.offset(c);
    return [building];

    return;

    if (poly.square < minBlockSq) {
      return [poly];
    } else {
      let c1 = poly.vector(this.findLongestEdge(poly));
      let c2 = c1.rotate90();
      while (true) {
        let blocks = slice(poly, c1, c2);
        if (blocks.length > 0) return blocks;
      }
    }
  }

  createGeometry() {
    this.geometry = [];
  }

  filterOutskirts() {
    let populatedEdges = [];

    let addEdge = (v1, v2, factor = 1.0) => {
      let dx = v2.x - v1.x;
      let dy = v2.y - v1.y;
      let distances = {};
      //TODO  think it might be calling arrayutils .max?
      let d = ArrayUtils.max(this.patch.shape, (v) => {
        return (distances[v] =
          (v != v1 && v != v2
            ? GeomUtils.distance2line(v1.x, v1.y, dx, dy, v.x, v.y)
            : 0) * factor);
      });

      populatedEdges.push({
        x: v1.x,
        y: v1.y,
        dx: dx,
        dy: dy,
        d: distances[d],
      });
    };

    let that = this;
    this.patch.shape.forEdge(function (v1, v2) {
      let onRoad = false;
      for (street in that.model.arteries)
        if (street.includes(v1) && street.includes(v2)) {
          onRoad = true;
          break;
        }

      if (onRoad) addEdge(v1, v2, 1);
      else {
        let n = that.model.getNeighbour(that.patch, v1);
        if (n != null)
          if (n.withinCity) addEdge(v1, v2, that.model.isEnclosed(n) ? 1 : 0.4);
      }
    });

    // For every vertex: if this belongs only
    // to patches within city, then 1, otherwise 0
    let density = [];
    //TODO double check this
    this.patch.shape.forEach((v) => {
      if (that.model.gates.includes(v)) {
        density.push(1);
      } else {
        ArrayUtils.every(that.model.patchByVertex(v), (p) => {
          return p.withinCity;
        })
          ? 2 * Random.float()
          : 0;
      }
    });

    this.geometry = this.geometry.filter(function (building) {
      let minDist = 1.0;
      populatedEdges.forEach((edge) => {
        building.forEach((v) => {
          // Distance from the center of the building to the edge
          let d = GeomUtils.distance2line(
            edge.x,
            edge.y,
            edge.dx,
            edge.dy,
            v.x,
            v.y
          );
          let dist = d / edge.d;
          if (dist < minDist) minDist = dist;
        });
      });

      let c = building.center;
      let i = that.patch.shape.interpolate(c);
      let p = 0.0;
      for (let j = 0; j < i.length; j++) p += density[j] * i[j];
      minDist /= p;

      return Random.fuzzy(1) > minDist;
    });
  }

  static findLongestEdge(poly) {
    return ArrayUtils.min(poly, function (v) {
      return -poly.vector(v).lengthFromCenter();
    });
  }

  getCityBlock() {
    let insetDist = [];
    let that = this;
    //not true for farms or slums that are outside the walls??
    //TODO review this when spawning things outside the wall.
    let innerPatch = this.model.wall == null || this.patch.withinWalls;
    this.patch.shape.forEdge(function (v0, v1) {
      //if this patch edge borders a wall of the city, give it some distance from the wall
      if (
        that.model.wall != null &&
        that.model.wall.bordersBy(that.patch, v0, v1)
      ) {
        // Not too close to the wall
        insetDist.push(Ward.MAIN_STREET / 2);
      } else {
        let onStreet =
          innerPatch &&
          that.model.plaza != null &&
          that.model.plaza.shape.findEdge(v1, v0) != -1;

        if (!onStreet) {
          for (let i = 0; i < that.model.arteries.length; i++) {
            const street = that.model.arteries[i];
            if (street.includes(v0) && street.includes(v1)) {
              onStreet = true;
              break;
            }
          }
        }
        insetDist.push(
          onStreet
            ? Ward.MAIN_STREET * 5
            : innerPatch
            ? Ward.REGULAR_STREET
            : Ward.ALLEY
        );
      }
    });

    let finalShape = this.patch.shape.isConvex()
      ? this.patch.shape.shrink(insetDist)
      : this.patch.shape.buffer(insetDist);

    //the shapes do not enclose themselves and render without stroke on oneside almost always
    //seems to just be an issue of migrating to paper.js the previous system in haxe must
    //have known to enclose the shape. Might want to fix this more concretely later on.
    if (
      finalShape[0].x != finalShape[finalShape.length - 1].x ||
      finalShape[0].y != finalShape[finalShape.length - 1].y
    )
      finalShape.push(new Point(finalShape[0].x, finalShape[0].y));

    return finalShape;
  }

  getLabel() {
    return null;
  }
}
