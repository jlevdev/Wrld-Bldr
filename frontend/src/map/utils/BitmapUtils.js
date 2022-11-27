import BitmapData from 'openfl/lib/openfl/display/BitmapData';
import PixelSnapping from 'openfl/lib/openfl/display/PixelSnapping';
import Assets from 'openfl/lib/openfl/Assets';
import Bitmap from 'openfl/lib/openfl/display/Bitmap';

export default class BitmapUtils {

	static colors = {};

	static create( id ) {
		return new Bitmap( Assets.getBitmapData( id ), PixelSnapping.ALWAYS, false );
	}

	static getColor( c ) {
		var bmp = colors.get( c );
		if (bmp == null) {
			bmp = new BitmapData( 1, 1, false, c );
			colors.set( c, bmp );
		}
		return bmp;
	}
}