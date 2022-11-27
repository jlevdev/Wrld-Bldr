import Random from '../utils/Random';
import Point from "../geom/Point";
import Patch from '../building/Patch';
import Model from '../building/Model';

import Polygon from '../geom/Polygon';
import GeomUtils from '../geom/GeomUtils';
import Ward from './Ward';

export default class Market extends Ward {

	createGeometry() {

		// fountain or statue
		let statue = Random.bool( 0.6 );
		// we always offset a statue and sometimes a fountain
		let offset = statue || Random.bool( 0.3 );

		let v0 = null;
		let v1 = null;
		statue = false;
		if (statue || offset) {
			// we need an edge both for rotating a statue and offsetting
			let length = -1.0;
			this.patch.shape.forEdge( function( p0, p1 ) {
				let len = Point.distance( p0, p1 );
				if (len > length) {
					length = len;
					v0 = p0;
					v1 = p1;
				}
			} );
		}

		let object;
		
		if (statue) {
			object = Polygon.rect( 15 + Random.float(), 15 + Random.float() );
			object.rotate( Math.atan2( v1.y - v0.y, v1.x - v0.x ) );
		} else {
			object = Polygon.circle( Random.int(7,15) );
		}

		if (offset) {
			let gravity = GeomUtils.interpolate( v0, v1 );
			object.offset( GeomUtils.interpolate( this.patch.shape.centroid, gravity, 0.2 + Random.float() * 0.4 ) );
		} else {
			object.offset( this.patch.shape.centroid );
		}

		object.drawShadows = false;

		this.geometry = [object];
	}

	rateLocation( model, patch ) {
		// One market should not touch another
		model.inner.forEach(p => {
			if (p.ward.getLabel()==="Market" && p.shape.borders( patch.shape ))
				return Number.POSITIVE_INFINITY;
		});

		// Market shouldn't be much larger than the plaza
		return model.plaza != null ? patch.shape.square / model.plaza.shape.square : patch.shape.distance( model.center );
	}

	getLabel() {return Ward.MARKET_WARD;}
}
