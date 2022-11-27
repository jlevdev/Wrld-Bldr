import { Point as PaperPoint } from "paper/dist/paper-full";

export default class Point extends PaperPoint {

	classLabel = "Point";

	constructor(x, y) {
		super(x, y)
	}

	static distance(p1 , p2) {
		return p1.getDistance(p2);
	}

    add ( p ) {
        return new Point(this.x+p.x, this.y+p.y);
    }

    subtract ( p ) {
        return new Point(this.x-p.x, this.y-p.y);
    }

    transfer(  q ) {
		this.set(q.x, q.y);
	}

	scale( f ) {
		return new Point( this.x * f, this.y * f );
	}

	norm( length=1 ) {
		const scaledPoint = new Point (this.x, this.y).normalize( length );
		//normalize is a paper js function, we want to return one of our point objects
		return new Point(scaledPoint.x, scaledPoint.y);
	}

	addEq( q ) {
		this.set(this.x+q.x, this.y+q.y);
	}

	subEq( q ) {
		this.set(this.x-q.x, this.y-q.y);
	}

	scaleEq( f ) {
		this.set(this.x*f, this.y*f);
	}

	atan( ) {
		return Math.atan2( this.y, this.x );
	}

	dot( p1, p2 ) {
		return p1.x * p2.x + p1.y * p2.y;
	}

	rotate90() {
		//user Paper JS rotate function
		const r = this.rotate(90);
		//convert the paper js point object to ours
		return new Point(r.x, r.y);
	}

	setTo(xa, ya) {
		this.set(xa, ya);
	}

	offset(dx, dy) {
		this.set(this.x+dx, this.y+dy);
	}

	lengthFromCenter() {
		const c = new Point(Paper.screen.w, Paper.screen.h);
		return Point.distance(this, c);
	}

	static polar(len, angle) {
		return new Point(len * Math.cos(angle),len * Math.sin(angle));
	}

}