import Point from "../geom/Point";
import Patch from '../building/Patch';
import Model from '../building/Model';
import CurtainWall from '../building/CurtainWall';

import ArrayUtils from '../utils/ArrayUtils';
import Ward from './Ward';

export default class Castle extends Ward {

	wall	;//: CurtainWall;

	constructor( model, patch ) {
		super( model, patch );

		this.wall = new CurtainWall( true, model, [patch], patch.shape.filter(
			function( v ) {return ArrayUtils.some( model.patchByVertex( v ),
				function( p ) {return !p.withinCity}
			)}
		) );
	}

	createGeometry() {
		var block = this.patch.shape.shrinkEq( Ward.MAIN_STREET * 2 );
		this.geometry = Ward.createOrthoBuilding( block, Math.sqrt( block.square ) * 4, 0.6 );
	}

	 getLabel() {return Ward.CASTLE_WARD;}
}
