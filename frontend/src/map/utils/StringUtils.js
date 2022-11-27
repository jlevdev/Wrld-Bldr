export default class StringUtils {

	static capitalize( s ) {
		return s.substr( 0, 1 ).toUpperCase() + s.substr( 1 );
	}

	static enumerate( a ) {
		switch (a.length) {
			case 0:
				return "";
			case 1:
				return a[0].toString();
			default:
				return a.slice( 0, a.length - 1 ).join( ", " ) + " and " + a[a.length - 1];
		}
	}

	static plural( s ) {
		if (s.substr( s.length - 3) == "man")
			return s.substr( 0, s.length - 3 ) + "men";
		else if (s.charAt( s.length - 1 ) == "s")
			return s + "es";
		return s + "s";
	}

	static genitive( s ) {
		return s.charAt( s.length - 1 ) == s ? s + "'" : s + "'s";
	}
}