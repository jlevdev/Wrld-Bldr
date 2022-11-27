import Graphics from '../render/Graphics'

export default class PatchView extends Graphics {

	static lastPatch = null; //Shape

	patch	;//: Patch;
	hotArea	;//: Sprite;

	constructor( patch ) {
		super();
		this.patch = patch;


		
	}

	onRollOver( e ) {}
    /*
		if (patch != lastPatch) {
			lastPatch = patch;
			Tooltip.instance.set( patch.ward.getLabel() );
		}*/
}

