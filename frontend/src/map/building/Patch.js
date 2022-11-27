import Point from '../geom/Point';
import Polygon from '../geom/Polygon';

export default class Patch {

	shape	;//: Polygon;
	ward 	;//: Ward;

	withinWalls	;//: Bool;
	withinCity	;//: Bool;

	constructor( vertices ) {
		this.shape = new Polygon( vertices );

		this.withinCity	= false;
		this.withinWalls = false;
	}

	static fromRegion( r ) {
		let result = [];
		r.vertices.forEach(tr => {
			result.push(tr.c)
		});
		return new Patch( result );
	}
}

