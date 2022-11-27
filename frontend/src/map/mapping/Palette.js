export default class Palette {

	paper	;//: Int;
	light	;///: Int;
	medium	;//: Int;
	dark		;//: Int;

	constructor( paper, light, medium, dark ) {
		this.paper	= paper;
		this.light	= light;
		this.medium	= medium;
		this.dark	= dark;
	}

	static DEFAULT	= new Palette( '#ccc5b8', '#99948a', '#67635c', '#1a1917' );
	static BLUEPRINT	= new Palette( '#455b8d', '#7383aa', '#a1abc6', '#fcfbff' );
	static BW		= new Palette( '#ffffff', '#cccccc', '#888888', '#000000' );
	static INK		= new Palette( '#cccac2', '#9a979b', '#6c6974', '#130f26' );
	static NIGHT		= new Palette( '#000000', '#402306', '#674b14', '#99913d');
	static ANCIENT	= new Palette( '#ccc5a3', '#a69974', '#806f4d', '#342414' );
	static COLOUR	= new Palette( '#fff2c8', '#d6a36e', '#869a81', '#4c5950' );
	static SIMPLE	= new Palette( '#ffffff', '#000000', '#000000', '#000000' );
}
