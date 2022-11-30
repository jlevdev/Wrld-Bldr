import Point from "../geom/Point";
import GeomUtils from '../geom/GeomUtils';
import Polygon from '../geom/Polygon';


import ArrayUtils from '../utils/ArrayUtils';


export default class Cutter {

	static bisect(poly, vertex, ratio = 0.5, angle = 0.0, gap = 0.0) {

		var next = poly.next(vertex);

		//get a point between this vertex and the next vertex. Defined by the ratio. .5 being halfway
		var p1 = GeomUtils.interpolate(vertex, next, ratio);
		var d = next.subtract(vertex);

		var cosB = Math.cos(angle);
		var sinB = Math.sin(angle);
		var vx = d.x * cosB - d.y * sinB;
		var vy = d.y * cosB + d.x * sinB;
		var p2 = new Point(p1.x - vy, p1.y + vx);
		//Visual.drawDots([vertex, next, p1, new Point( p1.x + d.x * ratio, p1.y + d.y * ratio )], 5);

		return poly.cut(p1, p2, gap);
	}

	static radial(poly, center = null, gap = 0.0) {

		if (center == null)
			center = poly.centroid;

		var sectors = [];
		poly.forEdge(function (v0, v1) {
			var sector = new Polygon([center, v0, v1]);
			if (gap > 0)
				sector = sector.shrink([gap / 2, 0, gap / 2]);

			sectors.push(sector);
		});
		return sectors;
	}

	static semiRadial(poly, center = null, gap = 0.0) {
		if (center == null) {
			var centroid = poly.centroid;
			center = ArrayUtils.min(poly, (v) => { return Point.distance(v, centroid) });
		}

		gap /= 2;

		var sectors = [];
		poly.forEdge(function (v0, v1) {
			if (v0 != center && v1 != center) {
				var sector = new Polygon([center, v0, v1]);
				if (gap > 0) {
					var d = [poly.findEdge(center, v0) == -1 ? gap : 0, 0, poly.findEdge(v1, center) == -1 ? gap : 0];
					sector = sector.shrink(d);
				}
				sectors.push(sector);
			}
		});
		return sectors;
	}

	static ring(poly, thickness) {

		var slices = [];
		poly.forEdge((v1, v2) => {
			var v = v2.subtract(v1);
			var n = v.rotate90().norm(thickness);
			slices.push({ p1: v1.add(n), p2: v2.add(n), len: v.length });
		});

		// Short sides should be sliced first
		slices.sort((s1, s2) => { return (s1.len - s2.len) });

		var peel = [];

		var p = poly;
		for (let i = 0; i < slices.length; i++) {
			var halves = p.cut(slices[i].p1, slices[i].p2);
			p = halves[0];
			if (halves.length == 2)
				peel.push(halves[1]);
		}

		return peel;
	}
}
