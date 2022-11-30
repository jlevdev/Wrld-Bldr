import Ward from './Ward';
import GeomUtils from '../geom/GeomUtils';
import Point from '../geom/Point';


export default class Cathedral extends Ward {

	createGeometry() {
		const block = this.getCityBlock();

		this.geometry = GeomUtils.largestRect(block)[0];
	}
	static rateLocation(model, patch) {
		// Ideally the main temple should overlook the plaza,
		// otherwise it should be as close to the plaza as possible
		if (model.plaza != null && patch.shape.borders(model.plaza.shape))
			return -1 / patch.shape.square
		else
			return patch.shape.distance(model.plaza != null ? model.plaza.shape.center : model.center) * patch.shape.square;
	}

	getLabel() { return Ward.CATHEDRAL_WARD; }
}
