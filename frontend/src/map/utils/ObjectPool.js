export default class ObjectPool {

	recycled;

	constructor() {
		this.recycled = [];
	}

	get() {
		var obj = this.recycled.pop();
		if (obj == null) {
			obj = {};
		}
		return obj;
	}

	recycle( obj ) {
		this.recycled.push( obj );
	}

	clear() {
		this.recycled = [];
	}
}