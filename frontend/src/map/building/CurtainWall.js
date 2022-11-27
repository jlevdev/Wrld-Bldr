import Point from "../geom/Point";

import Polygon from '../geom/Polygon';
import Random from '../utils/Random';
import Model from './Model';

import ArrayUtils from '../utils/ArrayUtils';
import PointUtils from '../utils/PointUtils';
import Visual from "../utils/Visual";

export default class CurtainWall {

	shape//	: Polygon;
	segments//	: Array<Bool>;
	gates//	: Array<Point>;
	towers//	: Array<Point>;

	real//	: Bool;
	patches//	: Array<Patch>;

	constructor( real, model, patches, reserved) {
        //real is wallsNeeded, if walls are not needed around the city, this is not "real"
		this.patches = patches;

		if (this.patches.length == 1) {
			this.shape = this.patches[0].shape
		} else {
			this.shape = Model.findCircumference( this.patches );
			if (real) {
				let smoothFactor = Math.min( 1, 40 / this.patches.length );
				let result = [];
				this.shape.forEach( v => { 
					result.push( reserved.includes( v ) ? v : this.shape.smoothVertex( v, smoothFactor ) ) });
				this.shape.set( result );
			}
		}

		//TODO ???
		this.segments = this.shape.map((v) => true);

		this.buildGates( real, model, reserved );
	}

	buildGates( real, model, reserved ) {
		this.gates = [];

		// Entrances are vertices of the walls with more than 1 adjacent inner ward
		// so that a street could connect it to the city center
		let entrances = null;
        if (this.patches.length > 1) {
			entrances = this.shape.filter( ( v ) => {
				return (!reserved.includes( v ) && ArrayUtils.count( this.patches, ( p ) => {return p.shape.includes( v )} ) > 1) 
			} );
		} else {
			entrances = this.shape.filter( ( v ) => {return !reserved.includes( v )} );
		}

		if (entrances.length == 0)
			throw "Bad walled area shape!";

		//randomly choose number of gates
		const gateNum = Random.int(1,5);

		do {
			let index = Random.int( 0, entrances.length );
			let gate = entrances[index];
			this.gates.push( gate );

			if (real) {
				let outerWards = model.patchByVertex( this.gate ).filter( ( w ) => {return !this.patches.includes( w )} );
				if (outerWards.length == 1) {
					// If there is no road leading from the walled patches,
					// we should make one by splitting an outer ward
					let outer = outerWards[0];
					if (outer.shape.length > 3) {
						let wall = this.shape.next( gate ).subtract( this.shape.prev( gate ) );
						let out = new Point( wall.y, -wall.x );

						let farthest = ArrayUtils.max( outer.shape, ( v ) =>
							{if (this.shape.includes( v ) || reserved.includes( v ))
								return Number.NEGATIVE_INFINITY;
							else {
								let dir = v.subtract( gate );
								return dir.dot( out ) / dir.length;
							}}
						);

						let newPatches = [];
						outer.shape.split( gate, farthest ).forEach(half => {
							newPatches.push(new Patch( half ));
						});
						ArrayUtils.replace( model.patches, outer, newPatches );
					}
				}
			}

			// Removing neighbouring entrances to ensure
			// that no gates are too close
			if (index == 0) {
				entrances.splice( 0, 2 );
				entrances.pop();
			} else if (index == entrances.length - 1) {
				entrances.splice( index - 1, 2 );
				entrances.shift();
			} else
				entrances.splice( index - 1, 3 );

		} while (entrances.length >= 3 && this.gates.length<gateNum);

		if (this.gates.length == 0)
			throw new Error( "Bad walled area shape!" );

		// Smooth further sections of the wall with gates
		if (real)
			this.gates.forEach( gate => { 
				gate.set( this.shape.smoothVertex( gate  ) ); });

	}

	buildTowers() {
		this.towers = [];
		if (this.real) {
			let len = this.shape.length;
			for (let i=0; i<len; i++) {
				let t = this.shape[i];
				if (!this.gates.includes( t ) && (this.segments[(i + len - 1) % len] || this.segments[i]))
					this.towers.push( t );
			}
		}
	}

	getRadius() {
		let radius = 0.0;
		this.shape.forEach(v => {
			radius = Math.max( radius, v.length );
		});
		return radius;
	}

	bordersBy( p, v0, v1 ) {
		let index = this.patches.includes( p ) ? this.shape.findEdge( v0, v1 ) : this.shape.findEdge( v1, v0 );
		if (index != -1 && this.segments[index])
			return true;
		return false;
	}

	borders( p ) {
		let withinWalls = this.patches.includes( p );
		let length = this.shape.length;

		for (let i=0; i<length; i++) 
            if (this.segments[i]) {
                let v0 = this.shape[i];
                let v1 = this.shape[(i + 1) % length];
                let index = withinWalls ?
                    p.shape.findEdge( v0, v1 ) :
                    p.shape.findEdge( v1, v0 );
                if (index != -1)
                    return true;
		    }

		return false;
	}
}
