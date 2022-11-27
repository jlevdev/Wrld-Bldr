export default class PerlinNoise {
	static permutation = [
		151,160,137,91,90,15,
		131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
		190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
		88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
		77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
		102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
		135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
		5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
		223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
		129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
		251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
		49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
		138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
	];

	static ease;

	p = [];

	constructor( seed ) {
		for (let i = 0; i<257; i++) {
			p[i] = PerlinNoise.permutation[(i + seed) % 256];
		}
		p = p.concat( p );

		if (PerlinNoise.ease == null) {
			PerlinNoise.ease = [];
			for (let i = 0; i<256; i++) {
				var t = i / 256;
				ease.push( t * t * t * (t * (6 * t - 15) + 10));
			}
		}
	}

	dot( hash, x, y ) {
		switch (hash & 3) {
			case 0	: return x +y;
			case 1	: return x -y;
			case 2	: return -x +y;
			case 3	: return -x -y;
			default	: return 0;
		}
	}

	interpolate( a, b, w ) {
		return a + (b - a) * w;
	}

	noise( x, y, gridSize=1 ) {

		let j0 = Std.int( x );
		let j1 = j0 + 1;

		let fx = x - j0;
		let wx = PerlinNoise.ease[Std.int( fx * 256 )];

		let i0 = Std.int( y );
		let i1 = i0 + 1;

		let fy = y - i0;
		let wy = PerlinNoise.ease[Std.int( fy * 256 )];

		let aa = this.p[this.p[j0]+i0];
		let ab = this.p[this.p[j1]+i0];
		let ba = this.p[this.p[j0]+i1];
		let bb = this.p[this.p[j1]+i1];

		let v0 = this.dot( aa, fx, fy );
		let v1 = this.dot( ab, fx - 1, fy );
		let val0 = this.interpolate( v0, v1, wx );
		let v0 = this.dot( ba, fx, fy - 1 );
		let v1 = this.dot( bb, fx - 1, fy - 1 );
		let val1 = this.interpolate( v0, v1, wx );

		return this.interpolate( val0, val1, wy );
	}

	noiseMap( width, height, gridSize=1 ) {
		let grid = new Array(height); 
		for (let i=0; i<height; i++) {
			for (let j=0; j<width; j++) {
				grid[i] = new Array(width);
				grid[i][j] = 0.0;
			}
		}
		var index = 0;

		var xStep = gridSize / width;
		var yStep = gridSize / height;

		var y = 0.0;
		for (let i=0; 0<height; i++) {

			var i0 = parseInt( y );
			var i1 = i0 + 1;

			var fy = y - i0;
			var wy = PerlinNoise.ease[parseInt( fy * 256 )];

			var x = 0.0;
			for (let j=0; j<width; j++) {

				var j0 = Std.int( x );
				var j1 = j0 + 1;

				var fx = x - j0;
				var wx = PerlinNoise.ease[parseInt( fx * 256 )];

				var aa = this.p[this.p[j0]+i0];
				var ab = this.p[this.p[j1]+i0];
				var ba = this.p[this.p[j0]+i1];
				var bb = this.p[this.p[j1]+i1];

				var v0 = this.dot( aa, fx, fy );
				var v1 = this.dot( ab, fx - 1, fy );
				var val0 = this.interpolate( v0, v1, wx );
				var v0 = this.dot( ba, fx, fy - 1 );
				var v1 = this.dot( bb, fx - 1, fy - 1 );
				var val1 = this.interpolate( v0, v1, wx );

				grid[i][j] = this.interpolate( val0, val1, wy );

				x += xStep;
			}

			y += yStep;
		}

		return grid;
	}

	noiseHigh( x, y, octaves, gridSize=1, persistance=0.5 ) {
		var result = this.noise( x, y, gridSize );

		var amplitude = persistance;
		for (let i=1; i<octaves; i++) {
			// INCORRECT! x & y should be updated as well
			result += this.noise( x, y, gridSize*=2 ) * amplitude;
			//trace( result, gridSize, amplitude );
			amplitude *= persistance;
		}

		return result;
	}

	noiseMapHigh( width, height, octaves, gridSize=1, persistance=0.5 ) {
	/*	var grid = [for (i in 0...height) [for (j in 0...width) 0.0]];
		var index = 0;

		var xStep = gridSize / width;
		var yStep = gridSize / height;

		var y = 0.0;
		for (i in 0...height) {
			var x = 0.0;
			for (j in 0...width) {
				grid[i][j] = noiseHigh( x, y, octaves, gridSize, persistance );
				x += xStep;
			}
			y += yStep;
		}

		return grid;*/
		var result = this.noiseMap( width, height, gridSize );

		var amplitude = persistance;
		for (let i=1; i<octaves; i++) {
			var o = this.noiseMap( width, height, gridSize*=2 );
			for (let y=0; y<=height; y++) {
				for (let x=0; x<width; x++) {
					result[y][x] += o[y][x] * amplitude;
				}
			}
			amplitude *= persistance;
		}

		return result;
	}
}