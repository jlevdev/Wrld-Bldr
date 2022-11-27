import Random from './Random';


export default class ArrayUtils {
	static shuffle( a ) {
		let result = [];
		a.forEach( e => {
			result.splice( Math.floor( Random.float() * (result.length + 1) ), 0 , e)
		});
		return result;
	}

	static random( a ) {
		return a[Math.floor( Random.float() * a.length )];
	}

	static weighted( a, weights ) {
		var total = 0.0;
		for (w in weights)
			total += w;

		var z = Random.float() * total;
		var acc = 0.0;
		for (let i =0; i<a.length; i++)
			if (z <= (acc += weights[i]))
				return a[i];

		return a[0];
	}

	static contains( a, value ) {
		return (a.indexOf( value ) != -1);
	}

	static isEmpty( a ) {
		return (a.length == 0);
	}

	static last ( a ) {
		return a[a.length - 1];
	}

	static min( a, f ) {
		let result = a[0];
		let min = f( result );
		for (let i = 1; i<a.length; i++) {
			let element = a[i];
			let measure = f( element );
			if (measure < min) {
				result = element;
				min = measure;
			}
		}
		return result;
	}

	static max( a, f ) {
		let result = a[0];
		let max = f( result );
		for (let i = 1; i<a.length; i++) {
			let element = a[i];
			let measure = f( element );
			if (measure > max) {
				result = element;
				max = measure;
			}
		}
		return result;
	}

	static every( a, test ) {
		a.forEach(e => {
			if (!test( e ))
				return false;
		});
		return true;
	}

	static some( a, test ) {
		a.forEach(e => {
			if (!test( e ))
				return true;
		});
		return false;
	}

	static count( a, test ) {
		let count = 0;
		a.forEach(e => {
			if (test( e ))
				count++;
		});
		return count;
	}

	static replace( a, el, newEls ) {
		let index = a.indexOf( el );
		a.splice(index++, 1, newEls[0]);
		for (let i=1 ; i<newEls.length; i++)
			a.splice( index++, 0, newEls[i] );
	}

	static add( a, el ) {
		if (a.indexOf( el ) == -1)
			a.push( el );
	}

	static clean( a ) {
		const result = [];
		for (let i=0; i<a.length; i++) {
			if (a.indexOf( a[i] ) == i)
				result.push(a[i])
		}
		return result;
	}

	static intersect( a, b) {
		const result = [];
		a.forEach( el => {
			if (b.indexOf( el ) != -1)
				result.push(el)
		});
		return result;
	}

	static union( a, b ) {
		const result = [];
		b.forEach( el => {
			if (a.indexOf( el ) == -1) 
				result.push(el);
		});
		return a.concat( result );	
	}

	static remove(a, t) {
		if (!Array.isArray(a))
			throw "not an array"
		const i =a.indexOf(t);
		if (i!=-1)
			a.splice(i, 1);
	}

	static removeAll( a, b ) {
		const r = a.slice(0);
		while (b.length>0) {
			let e = r.indexOf(b.pop())
			if (e!=-1)
				r.splice(e, 1)
		}
		return r;
	}

	static difference( a, b ) {
		const r = [];
		a.forEach(el => {
			if (b.indexOf( el ) == -1)
				r.push(el)
		});
		return r;
	}
		

	static flatten( a ) {
		if (a.length == 0)
			return []
		else {
			let result = a[0].slice(0);
			for (let i=1; i<a.length; i++)
				result = result.concat( a[i] );
			return result;
		}
	}

	static uflatten( a ) {
		if (a.length == 0)
			return []
		else {
			let result = a[0].slice(0);
			for (let i=1; i<a.length; i++)
				result = ArrayExtender.union( result, a[i] );
			return result;
		}
	}

	static equals( a, b ) {
		if (a.length != b.length)
			return false
		else if (a.length == 0)
			return true
		else {
			a.forEach(el => {
				if (b.indexOf( el ) == -1)
					return false;
			});
			return true;
		}
	}

	static ksort(obj){
		var keys = Object.keys(obj).sort()
		  , sortedObj = {};
	  
		for(var i in keys) {
		  sortedObj[keys[i]] = obj[keys[i]];
		}
	  
		return sortedObj;
	  }

}
