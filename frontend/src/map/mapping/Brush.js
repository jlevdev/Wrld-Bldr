import Graphics from "../render/Graphics";


export default class Brush {

	static NORMAL_STROKE = 0.5;
	static THICK_STROKE	= 1.800;
	static THIN_STROKE = 0.150;

	strokeColor	= '#000000';
	fillColor	= '#cccccc';
	stroke		= Brush.NORMAL_STROKE;

	palette		;//: Palette;

	static lastDark = -1;
	static lastPaper = -1;

	constructor( palette ) {
		this.palette = palette;
	}

	setFill( g, color ) {
		this.fillColor = color;
		g.beginFill( color );
	}

	setStroke( g, color=this.strokeColor, stroke=Brush.NORMAL_STROKE, miter=true ) {
		if (stroke == 0)
			this.noStroke( g );
		else {
			this.strokeColor = color;
			//TODO
			g.lineStyle( stroke, color, miter ? Graphics.JOIN_MITER : Graphics.JOIN_DEFAULT );
		}
	}

	noStroke( g ) {
		g.lineStyle( 0, 'rgba(0, 0, 0, 0)' );
	}

	onlyStroke(g) {
		g.beginFill(0,0);
	}

	setColor( g, fill, line=this.fillColor, stroke=Brush.NORMAL_STROKE, miter=true ) {
		this.setFill( g, fill );
		this.setStroke( g, line, stroke, miter );
	}
}
