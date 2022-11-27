import Random from '../utils/Random';

import Patch from '../building/Patch';
import Model from '../building/Model';
import CommonWard from './CommonWard';
import Ward from './Ward';

export default class MerchantWard extends CommonWard {

	constructor( model, patch )
{		super( model, patch,
			50 + 60 * Random.float() * Random.float(),	// medium to large
			0.5 + Random.float() * 0.3,	0.7,			// moderately regular
			0.15	);}

		rateLocation( model, patch )
		// Merchant ward should be as close to the center as possible
		{return patch.shape.distance( model.plaza != null ? model.plaza.shape.center : model.center );}

	getLabel() {return Ward.MERCHANT_WARD;}
}
