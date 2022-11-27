import Random from '../utils/Random';
import CommonWard from './CommonWard';
import Ward from './Ward';

export default class CraftsmenWard extends CommonWard {

	constructor( model, patch )
	{		super( model, patch,
			10 + 800 * Random.float() * Random.float(),	// small to large
			0.2 + Random.float() * 0.2, 1 );			// moderately regular
	}
	getLabel() {return Ward.CRAFTSMEN_WARD;}
}
