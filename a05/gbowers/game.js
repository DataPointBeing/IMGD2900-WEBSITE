/*
game.js for Perlenspiel 3.3.x
Last revision: 2022-03-15 (BM)

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

// Modded Toy
// Griffin Bowers
// Team: Carrot Bowl Studios

// Mod 1: Changed size of grid to 5 x 5
// Mod 2: Changed color of grid to orange
// Mod 3: Changed status line color to black
// Mod 4: Changed status line text to "Click all of the blue squares!"
// Mod 5: Changed the color of every bead to blue with an
// if-else loop nested in another if-else loop in a while loop
// Mod 6: Changed color the bead changes too when touched to black
// Mod 7: Used an if-else loop nested in another if-else loop in a while loop twice
// The first nested loop(s) checks if all the beads all black if they are all black...
// The second nested loop(s) change the color of the beads back to blue
// Mod 8: Change status text to "You Won! Click to play again!" after you turn all of the beads black
// Mod 9: Added changed status text after click to revert from the winning status text

"use strict"; // Do NOT remove this directive!

PS.init = function( system, options ) {
	// Establish grid dimensions
	// Mod 1: Changed size of grid to 5 x 5
	PS.gridSize( 5, 5 );

	// Set background color to Perlenspiel logo gray
	// Mod 2: Changed color of grid to orange
	PS.gridColor( 245, 155, 66 );

	// Change status line color and text
	// Mod 3: Changed status line color to black
	// Mod 4: Changed status line text to "Click all of the blue squares!"
	PS.statusColor( PS.COLOR_BLACK );
	PS.statusText( "Click all of the blue squares" );

	// Preload click sound

	PS.audioLoad( "fx_click" );

	// Mod 5: Changed the color of every bead to blue with an
	// if-else loop nested in another if-else loop in a while loop
	let aa = true;
	let xloc = 0;
	let yloc = 0;
	while(aa == true) {
		if(yloc == 5) {
			yloc = 0;
			xloc += 1;
			if(xloc == 5){
				aa = false;
			}
			else {
			PS.color( xloc, yloc, 48, 104, 187);
			}
		}
		else {
			PS.color( xloc, yloc, 48, 104, 187);
			yloc += 1;
		}
	}
};

PS.touch = function( x, y, data, options ) {
	// Toggle color of touched bead from white to black and back again
	// NOTE: The default value of a bead's [data] is 0, which happens to be equal to PS.COLOR_BLACK

	// Mod 6: Changed color the bead changes too when touched to black
	PS.color( x, y, PS.COLOR_BLACK ); // set color to current value of data

	// Mod 9: Added changed status text after click to revert from the winning status text
	PS.statusText( "Click all of the blue squares" );

	// Decide what the next color should be.
	// If the current value was black, change it to white.
	// Otherwise change it to black.

	// NOTE: This is not the most succinct way to code this functionality.
	// It's written this way for clarity.

	/*let next; // variable to save next color

	if ( data === PS.COLOR_BLACK ) {
		next = PS.COLOR_WHITE;
	}
	else {
		next = PS.COLOR_BLACK;
	}*/

	// NOTE: The above statement could be expressed more succinctly using JavaScript's ternary operator:
	// let next = ( data === PS.COLOR_BLACK ) ? PS.COLOR_WHITE : PS.COLOR_BLACK;

	// Remember the newly-changed color by storing it in the bead's data.

	//PS.data( x, y, next );



	// Mod 7: Used an if-else loop nested in another if-else loop in a while loop twice
	// The first nested loop(s) checks if all the beads all black if they are all black...
	// The second nested loop(s) change the color of the beads back to blue
	let loopA = true;
	let loopB = false;
	let xl = 0;
	let yl = 0;
	while(loopA == true) {
		if(yl == 5) {
			yl = 0;
			xl += 1;
			if(xl == 5){
				loopB = true;
				loopA = false;
			}
			else {
				if((PS.color( xl, yl)) !== (PS.COLOR_BLACK)) {
					loopA = false;
				}
			}
		}
		else {
			if((PS.color( xl, yl)) === (PS.COLOR_BLACK)) {
				yl += 1;
			}
			else {
				loopA = false;
			}
		}
	}

	let xlb = 0;
	let ylb = 0;
	// Mod 8: Change status text to "You Won! Click to play again!" after you turn all of the beads black
	if(loopB == true){
		PS.statusText( "You Won! Click to play again!" );
	}
	while(loopB == true) {
		if(ylb == 5) {
			ylb = 0;
			xlb += 1;
			if(xlb == 5){
				loopB = false;
			}
			else {
				PS.color( xlb, ylb, 48, 104, 187);
			}
		}
		else {
			PS.color( xlb, ylb, 48, 104, 187);
			ylb += 1;
		}
	}


	// Play click sound.

	PS.audioPlay( "fx_click" );
};

/*
PS.release ( x, y, data, options )
Called when the left mouse button is released, or when a touch is lifted, over bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.release = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
};

/*
PS.enter ( x, y, button, data, options )
Called when the mouse cursor/touch enters bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.enter = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
};

/*
PS.exit ( x, y, data, options )
Called when the mouse cursor/touch exits bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exit = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};

/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exitGrid = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};

/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyDown = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is pressed.
};

/*
PS.keyUp ( key, shift, ctrl, options )
Called when a key on the keyboard is released.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyUp = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};

/*
PS.input ( sensors, options )
Called when a supported input device event (other than those above) is detected.
This function doesn't have to do anything. Any value returned is ignored.
[sensors : Object] = A JavaScript object with properties indicating sensor status; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: Currently, only mouse wheel events are reported, and only when the mouse cursor is positioned directly over the grid.
*/

PS.input = function( sensors, options ) {
	// Uncomment the following code lines to inspect first parameter:

//	 var device = sensors.wheel; // check for scroll wheel
//
//	 if ( device ) {
//	   PS.debug( "PS.input(): " + device + "\n" );
//	 }

	// Add code here for when an input event is detected.
};

