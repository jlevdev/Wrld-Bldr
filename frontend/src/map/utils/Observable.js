import MathUtils from './MathUtils';

export default class Observable {

	_value;

	changed; //: Signal1<T> = new Signal1();

	constructor( v ) {
		_value = v;
	}

	 get_value() {
		return _value;
	}

	 set_value( v ) {
		this._value = v;
		this.changed.dispatch( _value );
		return _value;
	}
}

export class ObservableInt extends Observable {

	min;
	max;

	changed2 //: Signal2<Int, Int> = new Signal2();

	 new( v, min, max ) {
		super( v );
		this.min = min;
		this.max = max;
	}

	set_value( v ) {
		var old = this._value;
		v = MathUtils.gatei( v, min, max );
		this.changed2.dispatch( v, v - old );
		return super.set_value( v );
	}
}