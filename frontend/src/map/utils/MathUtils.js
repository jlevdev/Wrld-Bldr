export default class MathUtils {
	static gate( value, min, max ) {
		return value < min ? min : (value < max ? value : max);
	}

	static gatei( value, min, max ) {
		return value < min ? min : (value < max ? value : max);
	}

	static sign( value ) {
		return value == 0 ? 0 : (value < 0 ? -1 : 1);
	}
}
