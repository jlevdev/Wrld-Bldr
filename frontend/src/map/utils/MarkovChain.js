import ArrayUtils from './ArrayUtils';

class MarkovChain{

	table;	//: Map<T, FollowUp>;

	constructor() {
		table = {};
	}

	addSample( sample ) {
		let prev = null;
		for (let i=0; i<sample.length; i++) {
			let cur = sample[i];
			this.addCase( prev, cur );
			prev = cur;
		}
		this.addCase( prev, null );
	}

	addCase( a, b ) {
		var followUp = this.table[a];
		if (followUp == null)
			followUp = this.table[a] = new FollowUp();//new FollowUp<T>();

		followUp.observe( b );
	}

	generate(){
		var result = [];

		var state = null;
		while (true) {
			state = this.getNext( state );
			result.push( state );
			if (this.isTerminal( state ))
				break;
		}

		return result;
	}

	getNext( a ){
		return  this.table[a].get();
	}

	isTerminal( state ) { return false; };
}

class FollowUp {
	states = [];
	weights= [];

	observe( state ) {
		var index = this.states.indexOf( state );
		if (index == -1) {
			this.states.push( state );
			this.weights.push( 1 );
		} else
			this.weights[index]++;
	}

	get() {return ArrayUtils.weighted( this.states, this.weights );}
}

