import Random from '../utils/Random';
import ArrayUtils from '../utils/ArrayUtils';

import Polygon from '../geom/Polygon';
import GeomUtils from '../geom/GeomUtils';
import Ward from './Ward';

export default class Farm extends Ward {

	createGeometry() {
		//TODO make farm houses bigger
		var housing = Polygon.rect( 40, 40 );
		var pos = GeomUtils.interpolate( ArrayUtils.random(this.patch.shape), this.patch.shape.centroid, 0.3 + Random.float() * 0.4 );
		housing.rotate( Random.float() * Math.PI );
		housing.offset( pos );

		this.geometry = Ward.createOrthoBuilding( housing, 18, 0.5 );
	}

	getLabel() {return 	Ward.FARM_WARD;}
}
