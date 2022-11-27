import Random from '../utils/Random';

import Patch from '../building/Patch';
import Model from '../building/Model';
import CommonWard from './CommonWard';
import Ward from './Ward';

export default class PatriciateWard extends CommonWard {

	constructor( model, patch )
{		super( model, patch,
			80 + 30 * Random.float() * Random.float(),	// large
			0.5 + Random.float() * 0.3,	0.8,			// moderately regular
			0.2 );}

	rateLocation( model, patch ) {
		// Patriciate ward prefers to border a park and not to border slums
		let rate = 0;
		model.patches.forEach(p => {
			if (p.ward != null && p.shape.borders( patch.shape )) {
				if (p.ward.getLabel()==='Park')
					rate--
				else if (p.ward.getLabel()==='Slum')
					rate++;
			}
		});

		return rate;
	}

	getLabel() {return Ward.PATRICIATE_WARD;}
}
