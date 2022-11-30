import Ward from './Ward';


export default class CommonWard extends Ward {

	minSq;
	gridChaos;
	sizeChaos;
	emptyProb;

	constructor(model, patch, minSq, gridChaos, sizeChaos, emptyProb = 0.04) {
		super(model, patch);
		this.minSq = minSq;
		this.gridChaos = gridChaos;
		this.sizeChaos = sizeChaos;
		this.emptyProb = emptyProb;
	}

	createGeometry() {
		let block = this.getCityBlock();
		this.geometry = Ward.createAlleys(block, this.minSq, this.gridChaos, this.sizeChaos, this.emptyProb);
		if (!this.model.isEnclosed(this.patch))
			this.filterOutskirts();
	}
}
