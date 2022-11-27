import Random from '../utils/Random';

import Patch from '../building/Patch';
import Model from '../building/Model';
import CommonWard from './CommonWard';
import Ward from './Ward';


export default class AdministrationWard extends CommonWard {

	constructor( model, patch )
{		super( model, patch,
			80 + 30 * Random.float() * Random.float(),	// large
			0.1 + Random.float() * 0.3, 0.3 );			// regular
			}


	static rateLocation( model, patch )
{		// Ideally administration ward should overlook the plaza,
		// otherwise it should be as close to the plaza as possible
		return model.plaza != null ?
			(patch.shape.borders( model.plaza.shape ) ? 0 : patch.shape.distance( model.plaza.shape.center )) :
			patch.shape.distance( model.center );}

	getLabel() {return Ward.ADMINISTRATION_WARD;}
}

/*
import com.watabou.utils.Random;

import com.watabou.towngenerator.building.Patch;
import com.watabou.towngenerator.building.Model;

class AdministrationWard extends CommonWard {

	public inline function new( model:Model, patch:Patch )
		super( model, patch,
			80 + 30 * Random.float() * Random.float(),	// large
			0.1 + Random.float() * 0.3, 0.3 );			// regular


	public static function rateLocation( model:Model, patch:Patch ):Float
		// Ideally administration ward should overlook the plaza,
		// otherwise it should be as close to the plaza as possible
		return model.plaza != null ?
			(patch.shape.borders( model.plaza.shape ) ? 0 : patch.shape.distance( model.plaza.shape.center )) :
			patch.shape.distance( model.center );

	override public inline function getLabel() return "Administration";
}
*/