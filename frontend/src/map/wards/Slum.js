import Random from '../utils/Random';

import Patch from '../building/Patch';
import Model from '../building/Model';
import CommonWard from './CommonWard';
import Ward from './Ward';

export default class Slum extends CommonWard {

	constructor( model, patch )
	{		
		super( model, patch,
			10 + 30 * Random.float() * Random.float(),	// small to medium
			0.6 + Random.float() * 0.4,	0.8,			// chaotic
			0.03 );
	}

	rateLocation( model, patch )
		// Slums should be as far from the center as possible
		{return -patch.shape.distance( model.plaza != null ? model.plaza.shape.center : model.center );}

	getLabel() {return Ward.SLUM_WARD;}
}
