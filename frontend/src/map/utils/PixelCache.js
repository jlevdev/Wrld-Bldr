import BitmapData from 'openfl/lib/openfl/display/BitmapData';
import {} from 'openfl/lib/openfl/display/BitmapData';

export default class PixelCache {
	static cache = {}; //Map<UInt,BitmapData> = new Map();

	static get( color ) {
		let pixel = cache[color];
		if (pixel == null) {
			pixel = new BitmapData( 1, 1, false, color );
			cache[color] = pixel;
		}
		return pixel;
	}
}