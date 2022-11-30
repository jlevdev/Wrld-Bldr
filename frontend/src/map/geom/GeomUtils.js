import Point from "./Point";

import Polygon from "./Polygon";

export default class GeomUtils {
  static intersectLines(x1, y1, dx1, dy1, x2, y2, dx2, dy2) {
    var d = dx1 * dy2 - dy1 * dx2;
    if (d == 0) return null;

    var t2 = (dy1 * (x2 - x1) - dx1 * (y2 - y1)) / d;
    var t1 = dx1 != 0 ? (x2 - x1 + dx2 * t2) / dx1 : (y2 - y1 + dy2 * t2) / dy1;

    return new Point(t1, t2);
  }

  static interpolate(p1, p2, ratio = 0.5) {
    var d = p2.subtract(p1);
    return new Point(p1.x + d.x * ratio, p1.y + d.y * ratio);
  }

  static scalar(x1, y1, x2, y2) {
    return x1 * x2 + y1 * y2;
  }

  static cross(x1, y1, x2, y2) {
    return x1 * y2 - y1 * x2;
  }

  static distance2line(x1, y1, dx1, dy1, x0, y0) {
    return (
      (dx1 * y0 - dy1 * x0 + (y1 + dy1) * x1 - (x1 + dx1) * y1) /
      Math.sqrt(dx1 * dx1 + dy1 * dy1)
    );
  }

  // Gives the 2 closest intersection points between a ray with alpha radians
  // from the origin and the polygon. The two points should lie on opposite sides of the origin
  static intersectPoints(poly, origin, alpha) {
    let eps = 1e-9;
    origin = new Point(
      origin.x + eps * Math.cos(alpha),
      origin.y + eps * Math.sin(alpha)
    );
    const x0 = origin.x;
    const y0 = origin.y;
    let shiftedOrigin = new Point(x0 + Math.cos(alpha), y0 + Math.sin(alpha));

    let idx = 0;
    if (Math.abs(shiftedOrigin[0] - x0) < eps) {
      idx = 1;
    }
    let n = poly.length;
    let b = poly[n - 1];
    let minSqDistLeft = Number.MAX_VALUE;
    let minSqDistRight = Number.MAX_VALUE;
    let closestPointLeft = null;
    let closestPointRight = null;
    for (let i = 0; i < poly.length; i++) {
      let a = b;
      b = poly[i];

      let p = GeomUtils.lineIntersection(origin, shiftedOrigin, a, b);
      if (p != null && GeomUtils.pointInSegmentBox(p, a, b)) {
        let sqDist = GeomUtils.squaredDist(origin, p);
        if (Math.floor(p.x) != Math.floor(origin.x)) {
          if (p.x < origin.x) {
            if (sqDist < minSqDistLeft) {
              minSqDistLeft = sqDist;
              closestPointLeft = p;
            }
          } else if (p.x > origin.x) {
            if (sqDist < minSqDistRight) {
              minSqDistRight = sqDist;
              closestPointRight = p;
            }
          }
        } else {
          if (p.y < origin.y) {
            if (sqDist < minSqDistLeft) {
              minSqDistLeft = sqDist;
              closestPointLeft = p;
            }
          } else if (p.y > origin.y) {
            if (sqDist < minSqDistRight) {
              minSqDistRight = sqDist;
              closestPointRight = p;
            }
          }
        }
      }
    }
    return [closestPointLeft, closestPointRight];
  }

  static largestRect(poly, options = {}) {
    // step size for the aspect ratio
    const aspectRatioStep = 0.5;
    // step size for angles (in degrees); has linear impact on running time
    const angleStep = 5;

    options.maxAspectRatio =
      typeof options.maxAspectRatio === "undefined"
        ? 15
        : options.maxAspectRatio;
    options.minWidth =
      typeof options.minWidth === "undefined" ? 0 : options.minWidth;
    options.minHeight =
      typeof options.minHeight === "undefined" ? 0 : options.minHeight;
    options.tolerance =
      typeof options.tolerance === "undefined" ? 0.02 : options.tolerance;

    // Default value for the number of possible center points of the maximal rectangle
    options.nTries = typeof options.nTries === "undefined" ? 5 : options.nTries;

    /*
    if options.angle
    if options.angle instanceof Array then angles = options.angle
    else if typeof options.angle is 'number' then angles = [options.angle]
    else if typeof options.angle is 'string' and not isNaN(options.angle) then angles = [Number(options.angle)]
    if not angles? then angles = d3.range -90, 90+angleStep, angleStep*/
    const angles = GeomUtils.range(-90, 90 + angleStep, angleStep);
    let origins = [];

    /*
    if options.aspectRatio?
    if options.aspectRatio instanceof Array then aspectRatios = options.aspectRatio
    else if typeof options.aspectRatio is 'number' then aspectRatios = [options.aspectRatio]
    else if typeof options.aspectRatio is 'string' and not isNaN(options.aspectRatio) then aspectRatios = [Number(options.aspectRatio)]
    */

    /*if options.origin?
    if options.origin instanceof Array
      if options.origin[0] instanceof Array then origins = options.origin
      else origins = [options.origin]*/
    const area = poly.area();
    // get the width of the bounding box of the original polygon to determine tolerance
    var [minx, maxx] = poly.extent((d) => d.x);
    var [miny, maxy] = poly.extent((d) => d.y);

    // simplify polygon
    /* my polygons are pretty simple already
    let tolerance = Math.min(maxx - minx, maxy - miny) * options.tolerance
    if (tolerance > 0) {
      poly = GeomUtils.simplify(poly, tolerance)
    }*/

    // get the width of the bounding box of the simplified polygon
    var [minx, maxx] = poly.extent((d) => d.x);
    var [miny, maxy] = poly.extent((d) => d.y);
    let bBox = [
      [minx, miny],
      [maxx, miny],
      [maxx, maxy],
      [minx, maxy],
    ];
    var [boxWidth, boxHeight] = [maxx - minx, maxy - miny];

    // discretize the binary search for optimal width to a resolution of this times the polygon width
    let widthStep = Math.min(boxWidth, boxHeight) / 50;

    // populate possible center points with random points inside the polygon
    origins = origins == null ? [] : origins;
    // get the centroid of the polygon
    let centroid = poly.centroid;

    if (poly.pointInPoly(centroid, poly)) {
      origins.push(centroid);
    }

    // get few more points inside the polygon
    while (origins.length < options.nTries) {
      let rndX = Math.random() * boxWidth + minx;
      let rndY = Math.random() * boxHeight + miny;
      let rndPoint = new Point(rndX, rndY);
      if (poly.pointInPoly(rndPoint)) {
        origins.push(rndPoint);
      }
    }
    //Visual.drawDots(origins, 4);return;

    let maxArea = 0;
    let maxRect = null;

    for (let k = 0; k < angles.length; k++) {
      const angle = angles[k];
      let angleRad = (-angle * Math.PI) / 180;

      for (let i = 0; i < origins.length; i++) {
        const origOrigin = origins[i];
        // generate improved origins
        var [p1W, p2W] = GeomUtils.intersectPoints(poly, origOrigin, angleRad);
        var [p1H, p2H] = GeomUtils.intersectPoints(
          poly,
          origOrigin,
          angleRad + Math.PI / 2
        );
        if (p1W == null || (p2W == null) | (p1H == null) || p2H == null)
          continue;
        let modifOrigins = [
          new Point((p1W.x + p2W.x) / 2, (p1W.y + p2W.y) / 2), // average along with width axis
          new Point((p1H.x + p2H.x) / 2, (p1H.y + p2H.y) / 2), // average along with height axis
        ];

        for (let z = 0; z < modifOrigins.length; z++) {
          const origin = modifOrigins[z];
          var [p1W, p2W] = GeomUtils.intersectPoints(poly, origin, angleRad);

          if (p1W == null || (p2W == null) | (p1H == null) || p2H == null)
            continue;

          let minSqDistW = Math.min(
            GeomUtils.squaredDist(origin, p1W),
            GeomUtils.squaredDist(origin, p2W)
          );
          let maxWidth = 2 * Math.sqrt(minSqDistW);

          var [p1H, p2H] = GeomUtils.intersectPoints(
            poly,
            origin,
            angleRad + Math.PI / 2
          );

          if (p1W == null || (p2W == null) | (p1H == null) || p2H == null)
            continue;

          let minSqDistH = Math.min(
            GeomUtils.squaredDist(origin, p1H),
            GeomUtils.squaredDist(origin, p2H)
          );
          let maxHeight = 2 * Math.sqrt(minSqDistH);
          if (maxWidth * maxHeight < maxArea) continue;
          let aRatios;
          if (typeof aspectRatios != "undefined") {
            aRatios = aspectRatios;
          } else {
            let minAspectRatio = Math.max(
              1,
              options.minWidth / maxHeight,
              maxArea / (maxHeight * maxHeight)
            );
            let maxAspectRatio = Math.min(
              options.maxAspectRatio,
              maxWidth / options.minHeight,
              (maxWidth * maxWidth) / maxArea
            );
            aRatios = GeomUtils.range(
              minAspectRatio,
              maxAspectRatio + aspectRatioStep,
              aspectRatioStep
            );
          }
          for (let w = 0; w < aRatios.length; w++) {
            const aRatio = aRatios[w];
            // do a binary search to find the max width that works
            let left = Math.max(options.minWidth, Math.sqrt(maxArea * aRatio));
            let right = Math.min(maxWidth, maxHeight * aRatio);
            if (right * maxHeight < maxArea) continue;

            while (right - left >= widthStep) {
              let width = (left + right) / 2;
              let height = width / aRatio;
              let x0 = origin.x;
              let y0 = origin.y;
              let rectPoly = new Polygon([
                new Point(x0 - width / 2, y0 - height / 2),
                new Point(x0 + width / 2, y0 - height / 2),
                new Point(x0 + width / 2, y0 + height / 2),
                new Point(x0 - width / 2, y0 + height / 2),
              ]);

              rectPoly = Polygon.rotatePoly(rectPoly, angleRad, origin);

              if (GeomUtils.polyInsidePoly(rectPoly, poly)) {
                let insidePoly = true;
                // we know that the area is already greater than the maxArea found so far
                maxArea = width * height;
                maxRect = {
                  p: new Point(x0, y0),
                  width: width,
                  height: height,
                  angle: angle,
                };
                left = width; // increase the width in the binary search
              } else {
                let insidePoly = false;
                right = width; // decrease the width in the binary search
              }
            }
          }
        }
      }
    }
    return [maxRect, maxArea];
  }

  // Finds the intersection point (if there is one) of the lines p1q1 and p2q2
  static lineIntersection(p1, q1, p2, q2) {
    // allow for some margins due to numerical errors
    let eps = 1e-9;
    // find the intersection point between the two infinite lines
    let dx1 = p1.x - q1.x;
    let dy1 = p1.y - q1.y;
    let dx2 = p2.x - q2.x;
    let dy2 = p2.y - q2.y;
    let denom = dx1 * dy2 - dy1 * dx2;
    if (Math.abs(denom) < eps) return null;
    let cross1 = p1.x * q1.y - p1.y * q1.x;
    let cross2 = p2.x * q2.y - p2.y * q2.x;

    let px = (cross1 * dx2 - cross2 * dx1) / denom;
    let py = (cross1 * dy2 - cross2 * dy1) / denom;
    return new Point(px, py);
  }

  // Checks whether the point p is inside the bounding box of the line segment p1q1
  static pointInSegmentBox(p, p1, q1) {
    // allow for some margins due to numerical errors
    let eps = 1e-9;

    if (
      p.x < Math.min(p1.x, q1.x) - eps ||
      p.x > Math.max(p1.x, q1.x) + eps ||
      p.y < Math.min(p1.y, q1.y) - eps ||
      p.y > Math.max(p1.y, q1.y) + eps
    ) {
      return false;
    }
    return true;
  }

  // Check if polygon polyA is inside polygon polyB
  static polyInsidePoly(polyA, polyB) {
    let currentPointA = polyA[polyA.length - 1];

    for (let iA = 0; iA < polyA.length; iA++) {
      let prevPointA = currentPointA;
      currentPointA = polyA[iA];
      let currentPointB = polyB[polyB.length - 1];
      for (let iB = 0; iB < polyB.length; iB++) {
        let prevPointB = currentPointB;
        currentPointB = polyB[iB];
        if (
          GeomUtils.segmentsIntersect(
            prevPointA,
            currentPointA,
            prevPointB,
            currentPointB
          )
        )
          return false;
      }
    }

    return polyB.pointInPoly(polyA[0]);
  }

  static range(start, stop, step = 1) {
    (start = +start),
      (stop = +stop),
      (step =
        (n = arguments.length) < 2
          ? ((stop = start), (start = 0), 1)
          : n < 3
            ? 1
            : +step);

    var i = -1,
      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
      range = new Array(n);
    while (i < n) {
      i++;
      range[i] = start + i * step;
    }

    return range;
  }

  static segmentsIntersect(p1, q1, p2, q2) {
    let p = GeomUtils.lineIntersection(p1, q1, p2, q2);
    if (p == null) return false;
    return (
      GeomUtils.pointInSegmentBox(p, p1, q1) &&
      GeomUtils.pointInSegmentBox(p, p2, q2)
    );
  }

  /*
  (c) 2013, Vladimir Agafonkin
  Simplify.js, a high-performance JS polyline simplification library
  mourner.github.io/simplify-js
  */
  static simplify(points, tolerance, highestQuality) {
    //// Helper functions ///////////////////////////
    // square distance between 2 points
    function getSqDist(p1, p2) {
      var dx = p1[0] - p2[0],
        dy = p1[1] - p2[1];

      return dx * dx + dy * dy;
    }

    // square distance from a point to a segment
    function getSqSegDist(p, p1, p2) {
      var x = p1[0],
        y = p1[1],
        dx = p2[0] - x,
        dy = p2[1] - y;

      if (dx !== 0 || dy !== 0) {
        var t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);

        if (t > 1) {
          x = p2[0];
          y = p2[1];
        } else if (t > 0) {
          x += dx * t;
          y += dy * t;
        }
      }

      dx = p[0] - x;
      dy = p[1] - y;

      return dx * dx + dy * dy;
    }
    // rest of the code doesn't care about point format

    // basic distance-based simplification
    function simplifyRadialDist(points, sqTolerance) {
      var prevPoint = points[0],
        newPoints = [prevPoint],
        point;

      for (var i = 1, len = points.length; i < len; i++) {
        point = points[i];

        if (getSqDist(point, prevPoint) > sqTolerance) {
          newPoints.push(point);
          prevPoint = point;
        }
      }

      if (prevPoint !== point) newPoints.push(point);

      return newPoints;
    }

    // simplification using optimized Douglas-Peucker algorithm with recursion elimination
    function simplifyDouglasPeucker(points, sqTolerance) {
      var len = points.length,
        MarkerArray = typeof Uint8Array !== "undefined" ? Uint8Array : Array,
        markers = new MarkerArray(len),
        first = 0,
        last = len - 1,
        stack = [],
        newPoints = [],
        i,
        maxSqDist,
        sqDist,
        index;

      markers[first] = markers[last] = 1;

      while (last) {
        maxSqDist = 0;

        for (i = first + 1; i < last; i++) {
          sqDist = getSqSegDist(points[i], points[first], points[last]);

          if (sqDist > maxSqDist) {
            index = i;
            maxSqDist = sqDist;
          }
        }

        if (maxSqDist > sqTolerance) {
          markers[index] = 1;
          stack.push(first, index, index, last);
        }

        last = stack.pop();
        first = stack.pop();
      }

      for (i = 0; i < len; i++) {
        if (markers[i]) newPoints.push(points[i]);
      }

      return newPoints;
    }

    /////////////////////////////////////////////////
    if (points.length <= 1) throw "Polygon must have at least 2 points";

    let sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

    points = highestQuality ? points : simplifyRadialDist(points, sqTolerance);
    points = simplifyDouglasPeucker(points, sqTolerance);
    return points;
  }

  // Returns the squared euclidean distance between points a and b
  static squaredDist(a, b) {
    let deltax = b.x - a.x;
    let deltay = b.y - a.y;
    return deltax * deltax + deltay * deltay;
  }
}
