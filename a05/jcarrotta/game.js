/*
game.js for Perlenspiel 3.3.x
Last revision: 2022-03-15 (BM)

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

    // Preload click sound

    PS.audioLoad("fx_pop" );
    PS.audioLoad("fx_drip2");
    PS.audioLoad("fx_drip1");

    PS.timerStart(2, jellyTick);
};

function jellyTick()
{
    for (let i = 0; i < dimension_x; i++) {
        for (let j = 0; j < dimension_y; j++) {
            let this_data = PS.data(i, j);
            if (this_data !== 0)
            {
                const w = this_data.wiggliness;
                const delta = (toy_ticks-this_data.time_start);
                const wiggle_sin = Math.sin(delta * w) * w * 2;

                let temp_border = borderDefault(this_data.temp_scale);
                let temp_pupil_offset = 0;
                if (toy_ticks >= this_data.next_blink_time && toy_ticks < this_data.next_blink_time + this_data.blink_length)
                {
                    if (toy_ticks === this_data.next_blink_time && toy_ticks !== this_data.time_start)
                    {
                        const extra_wiggle = PS.random(11) - 1;
                        this_data.wiggliness += extra_wiggle;
                        if(extra_wiggle > 8)
                        {
                            playBubbleSound(6);
                        }
                    }

                    const blink_delta = toy_ticks - this_data.next_blink_time;
                    if (blink_delta > (0.3 * this_data.blink_length) && blink_delta < (0.7 * this_data.blink_length))
                    {
                        PS.glyph(i, j, 0);
                        PS.color(i, j, this_data.color);
                        temp_border = 0;
                    }
                    else
                    {
                        const blink_sin = (Math.sin(blink_delta * Math.PI / this_data.blink_length));
                        PS.glyph(i, j, getEye(this_data.eyeball));
                        PS.color(i, j, PS.COLOR_WHITE);
                        temp_pupil_offset = blink_sin * 50;
                        temp_border = temp_border + (blink_sin * 5);
                    }
                }
                else if (toy_ticks > this_data.next_blink_time + this_data.blink_length)
                {
                    this_data.next_blink_time = toy_ticks + PS.random(300) + 10;
                    this_data.blink_length = PS.random(8) + 2;
                    PS.glyph(i, j, getEye(this_data.eyeball));
                    PS.color(i, j, PS.COLOR_WHITE);
                }

                updateJellyRadius(i, j, this_data.radius + wiggle_sin);
                updateJellyScale(i, j, this_data.temp_scale + wiggle_sin, temp_border, temp_pupil_offset);

                this_data.wiggliness = this_data.wiggliness <= 1? 1 : (this_data.wiggliness * 3 / 4);
                this_data.temp_scale = this_data.temp_scale >= this_data.scale? this_data.scale : (this_data.temp_scale + 8);
                PS.data(i, j, this_data);
            }
        }
    }

    toy_ticks++;
}

function initSpace(x, y)
{
    PS.color(x, y, PS.COLOR_WHITE);
    PS.data(x, y, 0);
    PS.radius(x, y, 0);
    PS.border(x, y, 0);
    PS.bgAlpha(x, y, PS.ALPHA_OPAQUE);
    PS.bgColor(x, y, bg_color);
    PS.scale(x, y, 100);
    PS.alpha(x, y, 0);
    PS.glyph(x, y, 0);
}

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

function borderDefault (scale)
{
    return 20 * (scale / 100) - 4;
}

function updateJellyRadius(x, y, rad)
{
    PS.radius(x, y, rad);
}

function updateJellyScale(x, y, scale, border, pupil_offset)
{
    const g = PS.glyph(x, y);
    PS.glyph(x, y, 0);
    PS.scale(x, y, scale);
    PS.border(x, y, border);
    PS.glyphScale(x, y, scale - pupil_offset - 5);
    PS.glyph(x, y, g);
}

function toggleJelly(x, y, data)
{
    if (data !== 0)
    {
        initSpace(x, y);

        PS.audioPlay("fx_pop");
    }
    else
    {
        const my_color = PS.makeRGB(PS.random(0xc0) + 0x34, PS.random(0xc0) + 0x34, PS.random(0xc0) + 0x34);
        const rad_rand = PS.random(27) + 3;
        const size_rand = PS.random(45) + 53;

        let eyeball = 0; // 0x00B7, 0x2BCE
        if (rad_rand <= 12)
        {
            eyeball = 1; // 0x25EA, 0x2716
        }
        else if (rad_rand >= 20)
        {
            eyeball = 2; // 0x25D5, 0x272A
        }

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

        PS.data(x, y, jellyData);
        updateJelly(x, y, jellyData);

        PS.audioPlay("fx_drip2", {volume: ((PS.random(3) + 5) / 10)});
    }
}

PS.touch = function(x, y, data, options)
{
    toggleJelly(x, y, data);
};

function getEye(index)
{
    switch(index)
    {
        case 0:
            return 0x00B7;
        case 1:
            return 0x25EA;
        case 2:
            return 0x25D5;
    }
}

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
        data.wiggliness += 12;
        data.time_start = toy_ticks;

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