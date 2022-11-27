import Random from '../utils/Random';
import CommonWard from './CommonWard';
import Ward from './Ward';

export default class GateWard extends CommonWard {

	constructor( model, patch ){
		super( model, patch,
			10 + 50 * Random.float() * Random.float(),
			0.5 + Random.float() * 0.3, 0.7 );
		}

	getLabel() {return Ward.GATE_WARD;}
}
