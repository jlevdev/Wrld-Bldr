export default class NullUtils {
	static float( value, defValue ) {
		return value == null ? defValue : value;
	}

	static int( value, defValue ) {
		return value == null ? defValue : value;
	}

	static bool( value, defValue=false ) {
		return value == null ? defValue : value;
	}

	static string( value, defValue="" ) {
		return value == null ? defValue : value;
	}

	static array( value ) {
		return value == null ? [] : (Array.isArray(value) ? value : [value]);
	}

	static orEmpty( value ) {
		return value == null ? {} : value;
	}
}