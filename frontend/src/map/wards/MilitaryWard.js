import Random from '../utils/Random';

import Patch from '../building/Patch';
import Model from '../building/Model';
import Ward from './Ward';

export default class MilitaryWard extends Ward {

	createGeometry() {
		var block = this.getCityBlock();
		this.geometry = Ward.createAlleys( block,
			Math.sqrt( block.square ) * (1 + Random.float()),
			0.1 + Random.float() * 0.3,	0.3,			// regular
			0.25 );										// squares
	}

	rateLocation( model, patch )
{		// Military ward should border the citadel or the city walls
		return
			if (model.citadel != null && model.citadel.shape.borders( patch.shape ))
				0
			else if (model.wall != null && model.wall.borders( patch ))
				1
			else
				(model.citadel == null && model.wall == null ? 0 : Number.POSITIVE_INFINITY);}

	getLabel() {return Ward.MILITARY_WARD;}
}
