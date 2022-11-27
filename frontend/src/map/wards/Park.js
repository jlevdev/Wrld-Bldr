import Cutter from '../building/Cutter';
import Ward from './Ward';

export default class Park extends Ward {

	createGeometry() {
		var block = this.getCityBlock();
		this.geometry = [block];
		/*
		this.geometry = block.compactness >= 0.7 ?
			Cutter.radial( block, null, Ward.ALLEY ) :
			Cutter.semiRadial( block, null, Ward.ALLEY );*/
		this.geometry.forEach(p => {
			p.drawShadows = false;
		});
	}

	getLabel() {return Ward.PARK_WARD;}
}
