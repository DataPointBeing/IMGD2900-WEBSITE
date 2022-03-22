/*
John Carrotta
Carrot Bowl Studios

An ill-defined set of fiveish mods:
1. Turned the black/white pixels into random-coloration, random-size, animated jelly creatures with Unicode eyes
2. Changed the audio to be all drips, pops, and musical notes that play when jellies are hovered over
3. Changed the background color to be a dark gray, and made the grid 8x8 so as to fit 30.612% more jelly
4. Made the beads respond to the mouse cursor by vibrating on a sine wave (with decaying intensity).
5. Gave the beads idle animations: blinking and ambient vibrations, sometimes accompanied by random audio.

I had fun with this. I plan to polish it up more on my own time.
Next development would be the capacity to drag jellies around, and/or combine them to make new notes.
 */

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict"; // Do NOT remove this directive!

//let def_color = 0xeb4034;

const bg_color = 0x262626;
const dimension_x = 8;
const dimension_y = 8;

let toy_ticks = 0;

PS.init = function( system, options )
{
    // Establish grid dimensions

    PS.gridSize(dimension_x, dimension_y);

    initSpace(PS.ALL, PS.ALL);

    // Set background color to Perlenspiel logo gray

    PS.gridColor(0x303030);

    // Change status line color and text
    PS.statusColor( PS.COLOR_WHITE );
    PS.statusText( "Touch any bead" );

    // Preload jelly sounds
    PS.audioLoad("fx_pop" );
    PS.audioLoad("fx_drip2");
    PS.audioLoad("fx_drip1");

    PS.timerStart(2, jellyTick);
};

// Function to be run on a timer; updates jelly animations and handles blinking.
function jellyTick()
{
    for (let i = 0; i < dimension_x; i++) {
        for (let j = 0; j < dimension_y; j++) {
            let this_data = PS.data(i, j);

            // Is there a jelly here?
            if (this_data !== 0)
            {
                const w = this_data.wiggliness;
                const delta = (toy_ticks-this_data.time_start);

                // Sine wave upon which jellies wiggle
                const wiggle_sin = Math.sin(delta * w) * w * 2;

                let temp_border = borderDefault(this_data.temp_scale);
                let temp_pupil_offset = 0;

                // Are we mid-blink?
                if (toy_ticks >= this_data.next_blink_time && toy_ticks < this_data.next_blink_time + this_data.blink_length)
                {
                    // Add some light, random wiggle if a blink's just started.
                    if (toy_ticks === this_data.next_blink_time && toy_ticks !== this_data.time_start)
                    {
                        const extra_wiggle = PS.random(11) - 1;
                        this_data.wiggliness += extra_wiggle;

                        // Try to make a tiny noise upon a (relatively) violent wiggle.
                        if(extra_wiggle > 8)
                        {
                            playBubbleSound(6);
                        }
                    }

                    // Time since blink started
                    const blink_delta = toy_ticks - this_data.next_blink_time;

                    if (blink_delta > (0.3 * this_data.blink_length) && blink_delta < (0.7 * this_data.blink_length))
                    {
                        // Eye is fully closed in this range.
                        // Forget the border; remove the glyph and make the jelly's actual bead a solid color.
                        PS.glyph(i, j, 0);
                        PS.color(i, j, this_data.color);
                        temp_border = 0;
                    }
                    else
                    {
                        // Eye is still partially open in this range.
                        // Increase border thickness and contract the pupil for a nice blink transition.

                        // Sine wave upon which a blink operates (close, then open again)
                        const blink_sin = (Math.sin(blink_delta * Math.PI / this_data.blink_length));
                        PS.glyph(i, j, getEye(this_data.eyeball));
                        PS.color(i, j, PS.COLOR_WHITE);
                        temp_pupil_offset = blink_sin * 50;
                        temp_border = temp_border + (blink_sin * 5);
                    }
                }
                else if (toy_ticks > this_data.next_blink_time + this_data.blink_length) // We completed our blink
                {
                    // Queue up the next blink. (Divine the next time and its length.)
                    this_data.next_blink_time = toy_ticks + PS.random(300) + 10;
                    this_data.blink_length = PS.random(8) + 2;

                    // Fix the eye/body colors in case it didn't right itself.
                    PS.glyph(i, j, getEye(this_data.eyeball));
                    PS.color(i, j, PS.COLOR_WHITE);
                }

                // Actually modify the jelly based on the earlier calculations.
                updateJellyRadius(i, j, this_data.radius + wiggle_sin);
                updateJellyScale(i, j, this_data.temp_scale + wiggle_sin, temp_border, temp_pupil_offset);

                // Cause wiggle deterioration (by 25% per call)
                this_data.wiggliness = this_data.wiggliness <= 1? 1 : (this_data.wiggliness * 3 / 4);

                // Handle "temporary scaling" for when a jelly first spawns in...
                // We want a jelly to "grow" into existence when first spawned, so we store an actual size and a target one.
                this_data.temp_scale = this_data.temp_scale >= this_data.scale? this_data.scale : (this_data.temp_scale + 8);

                // Re-record the modified data to its bead.
                // This may not actually be necessary.
                PS.data(i, j, this_data);
            }
        }
    }

    // Increment ticks.
    toy_ticks++;
}

// Empty out (or initialize) a bead space.
function initSpace(x, y)
{
    PS.color(x, y, PS.COLOR_WHITE);
    PS.data(x, y, 0);
    PS.radius(x, y, 0);
    PS.border(x, y, 0);
    PS.bgAlpha(x, y, PS.ALPHA_OPAQUE);
    PS.bgColor(x, y, bg_color);

    // Ensure the scale is back to max, to avoid oddities in clickable space.
    PS.scale(x, y, 100);
    PS.alpha(x, y, 0);
    PS.glyph(x, y, 0);
}

// Force a jelly to load up fresh at the specified space w/ the specified data.
function updateJelly(x, y, data)
{
    PS.borderColor(x, y, data.color);
    PS.alpha(x, y, 255);
    PS.scale(x, y, data.temp_scale);
    PS.glyph(x, y, 0);
    PS.border(x, y, borderDefault(data.scale));
    PS.radius(x, y, data.radius);
    PS.glyph(x, y, getEye(data.eyeball));
    PS.glyphScale(x, y, data.scale - 5);
}

// Default calculation for border thickness based on jelly scale.
// Would be stellar for this to be able to change with monitor resolution.
function borderDefault (scale)
{
    return 20 * (scale / 100) - 4;
}

// Change a jelly bead's radius.
function updateJellyRadius(x, y, rad)
{
    PS.radius(x, y, rad);
}

// Change a jelly bead's scale.
function updateJellyScale(x, y, scale, border, pupil_offset)
{
    const g = PS.glyph(x, y);

    // Zeroing out the glyph before modifying scale/thickness avoids quibbles over character size!
    // Who knew?
    PS.glyph(x, y, 0);
    PS.scale(x, y, scale);
    PS.border(x, y, border);
    PS.glyphScale(x, y, scale - pupil_offset - 5);

    // It's not a bug, it's a feature. Presumably.
    PS.glyph(x, y, g);
}

// Toggle function for placing a jelly in an empty space, or deleting the jelly.
// This may be the only thing bearing a resemblance to the original toy. A superficial one, at that.
function toggleJelly(x, y, data)
{
    if (data !== 0)
    {
        // There's a jelly here! Eliminate it.
        initSpace(x, y);

        PS.audioPlay("fx_pop");
    }
    else
    {
        // There's no jelly here, so create one.

        // Randomize the color, rounded-ness, and size of the jelly.
        const my_color = PS.makeRGB(PS.random(0xc0) + 0x34, PS.random(0xc0) + 0x34, PS.random(0xc0) + 0x34);
        const rad_rand = PS.random(27) + 3;
        const size_rand = PS.random(45) + 53;

        // Select an eyeball index appropriate to its radius.
        // This also decides what instrument sound it plays!
        let eyeball = 0; // 0x00B7, 0x2BCE
        if (rad_rand <= 12)
        {
            eyeball = 1; // 0x25EA, 0x2716
        }
        else if (rad_rand >= 20)
        {
            eyeball = 2; // 0x25D5, 0x272A
        }

        // Compile the random data into an object for storage within the bead.
        // Also initialize a few factors: give it an initial wiggle, a tiny starting scale, and its first blink.
        const jellyData = {
            color: my_color,
            radius: rad_rand,
            scale: size_rand,
            eyeball: eyeball,
            time_start: toy_ticks,
            wiggliness: 40,
            temp_scale: 50,
            next_blink_time: toy_ticks,
            blink_length: 8
        };

        // Load this data into the bead, create the jelly, and play a satisfying sound at subtly random volume.
        PS.data(x, y, jellyData);
        updateJelly(x, y, jellyData);

        PS.audioPlay("fx_drip2", {volume: ((PS.random(3) + 5) / 10)});
    }
}

PS.touch = function(x, y, data, options)
{
    // Toggle the jelly-ness of whichever bead was clicked.
    toggleJelly(x, y, data);
};

// Return the relevant eye character for the given index.
function getEye(index)
{
    switch(index)
    {
        case 0:
            return 0x25CF;
        case 1:
            return 0x25EA;
        case 2:
            return 0x25D5;
    }

    // Would love to add a set of "surprised" Unicode eyes if I get a chance.
}

// Attempt to play a very quiet fluid-like sound.
// This provides some squishy ambient noise (sometimes) upon a blink, when the cursor touches a jelly, etc.
function playBubbleSound(rand_max)
{
    switch(PS.random(rand_max))
    {
        case 1:
            PS.audioPlay("fx_pop", {volume: (PS.random(4) / 100)});
            break;
        case 2:
            PS.audioPlay("fx_drip1", {volume: ((PS.random(4) + 2) / 100)});
            break;
        case 3:
            PS.audioPlay("fx_drip2", {volume: ((PS.random(4) + 2) / 100)});
            break;
        default:
            break;
    }
}

/*
PS.release ( x, y, data, options )
Called when the left mouse button is released, or when a touch is lifted, over bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.release = function( x, y, data, options )
{
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

PS.enter = function(x, y, data, options)
{
    if (data !== 0)
    {
        // There's a jelly here.

        // Disrupt it with some slight vibration. And reset its sine's "start time"
        data.wiggliness += 12;
        data.time_start = toy_ticks;

        // Based on the shape and size, play a musical note!
        switch(data.eyeball)
        {
            case 0:
                PS.audioPlay(PS.piano(120 - data.scale), {volume: 0.15});
                break;
            case 1:
                PS.audioPlay(PS.harpsichord(106 - data.scale), {volume: 0.15});
                break;
            case 2:
                PS.audioPlay(PS.xylophone(99 - data.scale), {volume: 0.2});
                break;
        }

        // If possible, would be great to add some percussion sounds.

        playBubbleSound(7);
    }
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

PS.exit = function( x, y, data, options )
{
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

PS.exitGrid = function( options )
{
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

PS.keyDown = function( key, shift, ctrl, options )
{
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

PS.keyUp = function( key, shift, ctrl, options )
{
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

PS.input = function( sensors, options )
{
    // Uncomment the following code lines to inspect first parameter:

//	 var device = sensors.wheel; // check for scroll wheel
//
//	 if ( device ) {
//	   PS.debug( "PS.input(): " + device + "\n" );
//	 }

    // Add code here for when an input event is detected.
};