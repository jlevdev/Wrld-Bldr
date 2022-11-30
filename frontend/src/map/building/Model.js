import Random from "../utils/Random";
import Voronoi from "../geom/Voronoi";
import Polygon from "../geom/Polygon";
import WB_Segment from "../geom/WB_Segment";
import CurtainWall from "./CurtainWall";

import AdministrationWard from "../wards/AdministrationWard";
import Castle from "../wards/Castle";
import Cathedral from "../wards/Cathedral";
import CraftsmenWard from "../wards/CraftsmenWard";
import Farm from "../wards/Farm";
import GateWard from "../wards/GateWard";
import Market from "../wards/Market";
import MerchantWard from "../wards/MerchantWard";
import MilitaryWard from "../wards/MilitaryWard";
import Park from "../wards/Park";
import PatriciateWard from "../wards/PatriciateWard";
import Slum from "../wards/Slum";
import Ward from "../wards/Ward";

import ArrayUtils from "../utils/ArrayUtils";
import Patch from "./Patch";
import Topology from "./Topology";

import Point from "../geom/Point";

import District from "./District";

/**
 * This file is the workhorse for creating everything to do with the map. It's a singleton that draws a map from a seed
 * Once all the math is done, MapDrawer takes what it has and produces a viewable map with the help of the Graphics class.
 */

export default class Model {
  static instance = null;

  settlementSize = null;

  nPatches = null;

  plazaNeeded = null;
  citadelNeeded = null;
  wallsNeeded = null;

  static WARDS = [
    CraftsmenWard,
    CraftsmenWard,
    MerchantWard,
    CraftsmenWard,
    CraftsmenWard,
    Cathedral,
    CraftsmenWard,
    CraftsmenWard,
    CraftsmenWard,
    CraftsmenWard,
    CraftsmenWard,
    CraftsmenWard,
    CraftsmenWard,
    CraftsmenWard,
    AdministrationWard,
    CraftsmenWard,
    Slum,
    CraftsmenWard,
    Slum,
    PatriciateWard,
    Slum,
    CraftsmenWard,
    CraftsmenWard,
    CraftsmenWard,
    Slum,
    CraftsmenWard,
    CraftsmenWard,
    CraftsmenWard,
    MilitaryWard,
    Slum,
    CraftsmenWard,
    Park,
    PatriciateWard,
    MerchantWard,
  ];

  topology = null;

  patches = null;
  waterbody = null;
  // For a walled city it's a list of patches within the walls,
  // for a city without walls it's just a list of all city wards
  inner = null; //array of patches
  outer = null;
  citadel = null;
  plaza = null;
  center = null;

  border = null;
  wall = null;

  cityRadius = null;

  // List of all entrances of a city including castle gates
  gates = null;

  // Joined list of streets (inside walls) and roads (outside walls)
  // without duplicating segments
  //all arrays of polygons
  arteries = null;
  streets = null;
  roads = null;

  allDistricts = [];

  locationCache = null;
  iconCache = null;
  NPCCache = null;
  ItemCache = null;

  screen = null;

  constructor(options) {
    Model.instance = this;

    console.log(options)
    if (options.caches) {
      this.locationCache = [...options.caches.location];

      this.NPCCache = [...options.caches.npc];

      this.iconCache = Object.assign({}, options.caches.icons);
    }

    this.screen = options.screen;

    if (options.seed > 0) Random.reset(options.seed);
    this.nPatches = options.nPatches != -1 ? options.nPatches : 15;
    //might be dependant on user input settings later
    this.plazaNeeded = true; //Random.bool();
    this.citadelNeeded = false; //Random.bool();
    this.wallsNeeded = false; //Random.bool();
    this.build();
  }

  build() {
    this.streets = [];
    this.roads = [];

    this.buildPatches();
    this.optimizeJunctions();
    this.buildWalls();
    this.buildStreets();
    this.createWards();
    this.buildGeometry();
    this.createDistricts();
  }

  buildGeometry() {
    this.patches.forEach((patch) => {
      patch.ward.createGeometry();
    });
  }

  buildPatches() {
    let sa = Random.float() * 2 * Math.PI;
    let points = [];
    let skip = 0;
    for (let i = 0; i < this.nPatches * 10; i++) {
      //TODO: this should be handled mathmatically
      skip++;
      if (skip > 1) {
        skip = 0;
        continue;
      }
      let pointY,
        pointX = null;
      let a = sa + Math.sqrt(i) * 5;
      ////////////////
      let r =
        i == 0
          ? 0
          : this.nPatches * 3 + Random.int(-35, 35) + i * (3 + Random.float());
      r = r * 0.9;
      pointX = Math.cos(a) * r;
      pointY = Math.sin(a) * r;
      points.push(
        new Point(pointX + this.screen.w / 2, pointY + this.screen.h / 2)
      );
    }

    let voronoi = Voronoi.build(points);

    // Relaxing central wards
    for (let i = 0; i < 3; i++) {
      let toRelax = [];
      for (let j = 0; j < 3; j++) {
        toRelax.push(voronoi.points[j]);
      }
      toRelax.push(voronoi.points[this.nPatches]);
      voronoi = Voronoi.relax(voronoi, toRelax);
    }
    /*
        voronoi.points.sort( ( p1, p2 ) => {
          return MathUtils.sign( p1.length - p2.length ) 
        });*/

    let regions = voronoi.partioning();

    this.patches = [];
    this.inner = [];

    let count = 0;

    regions.forEach((r) => {
      let patch = Patch.fromRegion(r);

      this.patches.push(patch);

      if (count == 0) {
        const screenCenter = new Point(this.screen.w / 2, this.screen.h / 2);
        this.center = ArrayUtils.min(patch.shape, (p) => {
          return Point.distance(p, screenCenter);
        });
        if (this.plazaNeeded) this.plaza = patch;
      } else if (count == this.nPatches && this.citadelNeeded) {
        this.citadel = patch;
        this.citadel.withinCity = true;
      }

      if (count < this.nPatches) {
        patch.withinCity = true;
        patch.withinWalls = this.wallsNeeded;
        this.inner.push(patch);
      }

      count++;
    });

    //debug code
    this.v = voronoi;
  }

  buildStreets() {
    function smoothStreet(street) {
      let smoothed = street.smoothVertexEq(3);
      for (let i = 1; i < street.length - 1; i++) street[i].set(smoothed[i]);
    }

    this.topology = new Topology(this);

    let excludeNodes = [];
    let lessthanX = 0;
    let lessthanY = 0;
    let greaterthanX = 0;
    let greaterthanY = 0;

    this.gates.forEach((gate) => {
      // Each gate is connected to the nearest corner of the plaza or to the central junction
      let end =
        this.plaza != null
          ? ArrayUtils.min(this.plaza.shape, function (v) {
            return Point.distance(v, gate);
          })
          : this.center;
      let street = this.topology.buildPath(gate, end, this.topology.outer);

      if (street != null) {
        street = new Polygon(street["points"]);

        this.streets.push(street);

        if (this.border.gates.includes(gate)) {
          //Here, we're getting the direction the road should go in (off map) by treating the point
          //as a vector. We just want the vector to go further into it's quadrent and to do so,
          //we compensate for the fact that 0,0 is in the top left of the screen instead of the center
          //as it usually is on a graph. This lets negative points (vectors) search further into the top and left quads
          let dir = gate
            .subtract(new Point(this.screen.w / 2, this.screen.h / 2))
            .norm(1000, true);
          let start = null;
          let dist = Number.POSITIVE_INFINITY;
          this.topology.node2pt.forEach((p) => {
            let offScreen = false;

            if (p.x < 1) lessthanX++;
            else if (p.x > this.screen.w) greaterthanX++;

            if (p.y < 1) lessthanY++;
            else if (p.y > this.screen.h) greaterthanY++;

            if (
              p.x < 1 ||
              p.x > this.screen.w ||
              p.y < 1 ||
              p.y > this.screen.h
            ) {
              offScreen = true;
            }
            if (offScreen) {
              let d = Point.distance(p, dir);
              if (d < dist) {
                dist = d;
                start = p;
              }
            }
          });
          let path = this.topology.buildPath(start, gate, [
            ...this.topology.inner,
            ...excludeNodes,
          ]);
          if (path != null) {
            this.roads.push(path.points);
            excludeNodes = [...excludeNodes, ...path.nodes];
          }
        }
      } else {
        throw new Error("Unable to build a street!");
      }
    });

    this.tidyUpRoads();

    for (let i = 0; i < this.arteries.length; i++) {
      const a = this.arteries[i];
      smoothStreet(a);
    }

    for (let i = 0; i < this.streets.length; i++) {
      const s = this.streets[i];
      smoothStreet(s);
    }
  }

  buildWalls() {
    let reserved = this.citadel != null ? this.citadel.shape.slice(0) : [];

    this.border = new CurtainWall(this.wallsNeeded, this, this.inner, reserved);
    if (this.wallsNeeded) {
      this.wall = this.border;
      this.wall.buildTowers();
    }

    let radius = this.border.getRadius();
    this.patches = this.patches.filter((p) => {
      return p.shape.distance(this.center) < radius * 3;
    });

    this.gates = this.border.gates;

    if (this.citadel != null) {
      while (true) {
        let castle = new Castle(this, this.citadel);
        castle.wall.buildTowers();
        this.citadel.ward = castle;

        if (this.citadel.shape.compactness >= 0.75) {
          this.gates = this.gates.concat(castle.wall.gates);
          break;
        }
      }
    }
  }

  createDistricts() {
    function removeFrom(unassigned, target) {
      for (let i = 0; i < unassigned.length; i++) {
        const t = unassigned[i];
        if (t == target) {
          return unassigned.splice(i, 1)[0];
        }
      }
      throw "District not in unassigned";
    }

    function getDistrictlessInnerNeighbors(patch) {
      let n = Model.instance.getNeighbours(patch);
      return n.filter((p) => {
        return (
          Model.instance.inner.includes(p) && typeof p.district === "undefined"
        );
      });
    }

    let patchesPerDistrict = Math.floor(this.inner.length / Random.int(5, 9));
    patchesPerDistrict += (patchesPerDistrict % this.inner.length) + 1;

    let unassigned = this.inner.slice(0);

    while (unassigned.length > 0) {
      let currentDistrict = new District();
      let startingPatch = unassigned.splice(
        Random.int(0, unassigned.length),
        1
      )[0];
      currentDistrict.push(startingPatch);
      let initialTargets = getDistrictlessInnerNeighbors(startingPatch);

      for (let i = 0; i < initialTargets.length; i++) {
        const p = initialTargets[i];
        if (unassigned.includes(p)) {
          currentDistrict.push(removeFrom(unassigned, p));
        }
      }

      let count = 0;

      while (
        currentDistrict.length < patchesPerDistrict &&
        count < currentDistrict.length &&
        unassigned.length > 0
      ) {
        const target = currentDistrict[count];
        const neighbors = getDistrictlessInnerNeighbors(target);

        for (let i = 0; i < neighbors.length; i++) {
          const n = neighbors[i];
          if (unassigned.includes(n)) {
            currentDistrict.push(removeFrom(unassigned, n));
          }
        }

        count++;
      }
    }

    let exceptions = [];

    //TODO:
    //Sometimes single districts will not rejoin as they are "islands" that
    //have no neighbors. This is probabaly an issue with the way inner is built.
    //instead of forcibly joining them to a new district I'm just going to
    //let islands be lone district as it makes more sense in terms of city layout.
    for (let i = 0; i < Model.instance.allDistricts.length; i++) {
      const d = Model.instance.allDistricts[i];

      if (exceptions.indexOf(i) != -1) continue;

      if (d.length == 1) {
        const target = d[0];
        const neighbors = this.getNeighbours(target);

        if (neighbors.length < 1) {
          exceptions.push(i);
          continue;
        }

        let foundNewDistrict = false;

        for (let k = 0; k < neighbors.length; k++) {
          const n = neighbors[k];
          if (typeof n.district != "undefined") {
            foundNewDistrict = true;
            n.district.push(target);
            Model.instance.allDistricts.splice(i, 1);
            break;
          }
        }

        if (!foundNewDistrict) exceptions.push(i);

        i = -1;
      }
    }
  }

  createWards() {
    let unassigned = this.inner.slice(0);
    if (this.plaza != null) {
      this.plaza.ward = new Market(this, this.plaza);
      ArrayUtils.remove(unassigned, this.plaza);
    }

    // Assigning inner city gate wards
    this.border.gates.forEach((gate) => {
      this.patchByVertex(gate).forEach((patch) => {
        if (
          patch.withinCity &&
          patch.ward == null &&
          Random.bool(this.wall == null ? 0.2 : 0.5)
        ) {
          patch.ward = new GateWard(this, patch);
          ArrayUtils.remove(unassigned, patch);
        }
      });
    });

    let wards = Model.WARDS.slice(0);
    // some shuffling

    for (let i = 0; i < Math.floor(wards.length / 10); i++) {
      let index = Random.int(0, wards.length - 1);
      let tmp = wards[index];
      wards[index] = wards[index + 1];
      wards[index + 1] = tmp;
    }

    // Assigning inner city wards
    while (unassigned.length > 0) {
      let bestPatch = null;

      let wardClass = wards.length > 0 ? wards.shift() : Slum;

      if (typeof wardClass.rateLocation === "undefined") {
        do bestPatch = ArrayUtils.random(unassigned);
        while (bestPatch.ward != null);
      } else {
        bestPatch = ArrayUtils.min(unassigned, function (patch) {
          return patch.ward == null
            ? wardClass.rateLocation(Model.instance, patch)
            : Math.POSITIVE_INFINITY;
        });
      }

      bestPatch.ward = new wardClass(Model.instance, bestPatch);

      ArrayUtils.remove(unassigned, bestPatch);
    }

    // Outskirts
    if (this.wall != null) {
      this.wall.gates.forEach((gate) => {
        patchByVertex(gate).forEach((patch) => {
          if (patch.ward == null) {
            patch.withinCity = true;
            patch.ward = new GateWard(Model.instance, patch);
          }
        });
      });
    }

    // Calculating radius and processing countryside
    this.cityRadius = 0;
    this.patches.forEach((patch) => {
      if (patch.withinCity) {
        // Radius of the city is the farthest point of all wards from the center
        patch.shape.forEach((v) => {
          this.cityRadius = Math.max(this.cityRadius, v.length);
        });
      } else if (patch.ward == null) {
        //change to slums or farms later
        patch.ward =
          Random.bool(0.2) && patch.shape.compactness >= 0.7
            ? new Farm(Model.instance, patch)
            : new Ward(Model.instance, patch);
      }
    });
  }

  drawPlaza() {
    Visual.polygon(this.plaza.shape, false);
  }

  //Debug function
  drawRegionCenters() {
    let p = [];
    this.v.partioning().forEach((r) => {
      p.push(r.seed);
      r.vertices.forEach((v) => {
        let t = [];
        t.push(v.p1);
        t.push(v.p2);
        t.push(v.p3);
        Visual.polygon(t, false);
      });
    });
    Visual.sib(p, "#FF0000");
  }

  drawGates() {
    Visual.drawDots(this.gates);
  }

  static findCircumference(wards) {
    if (wards.length == 0) return new Polygon();
    else if (wards.length == 1) return new Polygon(wards[0].shape);
    let A = [];
    let B = [];

    for (let k = 0; k < wards.length; k++) {
      const w1 = wards[k];
      w1.shape.forEdge((a, b) => {
        let outerEdge = true;
        for (let i = 0; i < wards.length; i++) {
          const w2 = wards[i];
          if (w2.shape.findEdge(b, a) != -1) {
            outerEdge = false;
            break;
          }
        }

        if (outerEdge) {
          A.push(a);
          B.push(b);
        }
      });
    }

    let result = new Polygon();
    let index = 0;
    do {
      result.push(A[index]);
      index = A.indexOf(B[index]);
    } while (index != 0);

    return result;
  }

  getNeighbour(patch, v) {
    let next = patch.shape.next(v);
    for (let i = 0; i < this.patches.length; i++) {
      const p = this.patches[i];
      if (p.shape.findEdge(next, v) != -1) return p;
    }
    return null;
  }

  getNeighbours(patch) {
    return this.patches.filter(function (p) {
      return p != patch && p.shape.borders(patch.shape);
    });
  }

  // A ward is "enclosed" if it belongs to the city and
  // it's surrounded by city wards and water
  isEnclosed(patch) {
    return (
      patch.withinCity &&
      (patch.withinWalls ||
        ArrayUtils.every(this.getNeighbours(patch), function (p) {
          return p.withinCity;
        }))
    );
  }

  optimizeJunctions() {
    let patchesToOptimize =
      this.citadel == null ? this.inner : this.inner.concat([this.citadel]);

    let wards2clean = [];
    patchesToOptimize.forEach((w) => {
      let index = 0;
      while (index < w.shape.length) {
        let v0 = w.shape[index];
        let v1 = w.shape[(index + 1) % w.shape.length];

        if (v0 != v1 && Point.distance(v0, v1) < 8) {
          this.patchByVertex(v1).forEach((w1) => {
            if (w1 != w) {
              w1.shape[w1.shape.indexOf(v1)] = v0;
              wards2clean.push(w1);
            }
          });
          v0.addEq(v1);
          v0.scaleEq(0.5);

          ArrayUtils.remove(w.shape, v1);
        }
        index++;
      }
    });

    // Removing duplicate vertices

    wards2clean.forEach((w) => {
      for (let i = 0; i < w.shape.length; i++) {
        let v = w.shape[i];
        let dupIdx;
        while ((dupIdx = w.shape.indexOf(v, i + 1)) != -1) {
          w.shape.splice(dupIdx, 1);
        }
      }
    });
  }

  patchByVertex(v) {
    return this.patches.filter((patch) => patch.shape.includes(v));
  }

  tidyUpRoads() {
    let segments = [];
    let that = this;

    function cut2segments(street) {
      let v0 = null;
      let v1 = street[0];
      for (let i = 1; i < street.length; i++) {
        v0 = v1;
        v1 = street[i];

        // Removing segments which go along the plaza
        if (
          that.plaza != null &&
          that.plaza.shape.includes(v0) &&
          that.plaza.shape.includes(v1)
        )
          continue;

        let exists = false;
        for (let k = 0; k < segments.length; k++) {
          const seg = segments[k];
          if (seg.start == v0 && seg.end == v1) {
            exists = true;
            break;
          }
        }

        if (!exists) segments.push(new WB_Segment(v0, v1));
      }
    }

    this.streets.forEach((street) => {
      cut2segments(street);
    });
    this.roads.forEach((road) => {
      cut2segments(road);
    });

    this.arteries = [];
    while (segments.length > 0) {
      let seg = segments.pop();

      let attached = false;
      for (let i = 0; i < this.arteries.length; i++) {
        const a = this.arteries[i];
        if (a[0] == seg.end) {
          a.unshift(seg.start);
          attached = true;
          break;
        } else if (ArrayUtils.last(a) == seg.start) {
          a.push(seg.end);
          attached = true;
          break;
        }
      }

      if (!attached) this.arteries.push(new Polygon([seg.start, seg.end]));
    }
  }
}
