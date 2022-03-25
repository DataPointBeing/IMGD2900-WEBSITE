/*

*/

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict"; // Do NOT remove this directive!

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

let currentPage = -1;

let recording;
let playing;
let time;
let max_time;

let pages = [
	{ // PIANO
		grid_x: 12,
		grid_y: 12,

		icon_color: 0xF0F0F0,
		icon_glyph: 0x2B13,
		icon_glyph_color: 0x0F0F0F,

		bg_color: 0x4b4233,

		generator_fn: function(index)
		{
			return place_note(index, 88, 0, 8, PS.piano,
				[0xaa, 0xa5, 0x84], [0xe5, 0xdf, 0xbf],
				[0x2d, 0x2d, 0x2c], [0x6f, 0x6f, 0x6b],
				[0x6f, 0x6f, 0x6b], [0xf5, 0xb3, 0x25],
				[0xe5, 0xdf, 0xbf], [0xaa, 0xa5, 0x84],
				true);
		},

		playback: {},
		volume: 0.5,
	},
	{ // HARPSICHORD
		grid_x: 12,
		grid_y: 9,

		icon_color: 0xF0F0F0,
		icon_glyph: 0x25EE,
		icon_glyph_color: 0xFAC460,

		bg_color: 0xC37C1C,

		generator_fn: function(index)
		{
			return place_note(index, 57, 2, 7, PS.harpsichord,
				[0xA0, 0x93, 0x09], [0xC3, 0xB4, 0x1C],
				[0xf5, 0xb3, 0x25], [0xff, 0xd9, 0x87],
				[0xff, 0xd9, 0x87], [0xf5, 0xb3, 0x25],
				[0xC3, 0xB4, 0x1C], [0xA0, 0x93, 0x09],
				true);
		},

		playback: {},
		volume: 0.5,
	},
	{ // XYLOPHONE
		grid_x: 12,
		grid_y: 7,

		icon_color: 0xF0F0F0,
		icon_glyph: 0x2BCE,
		icon_glyph_color: 0x5d2906,

		bg_color: 0xFFD79C,

		generator_fn: function(index)
		{
			return place_note(index, 57, 4, 7, PS.xylophone,
				[0x5F, 0x24, 0x0A], [0xdc, 0x8c, 0x66],
				[0x9A, 0x3B, 0x53], [0xC9, 0x5D, 0x78],
				[0xC9, 0x5D, 0x78], [0x9A, 0x3B, 0x53],
				[0xdc, 0x8c, 0x66], [0x5F, 0x24, 0x0A],
				false);
		},

		playback: {},
		volume: 0.5,
	},
];



function color_lerp(ratio, min_c, max_c)
{
	return [ratio*(max_c[0] - min_c[0]) + min_c[0], ratio*(max_c[1] - min_c[1]) + min_c[1], ratio*(max_c[2] - min_c[2]) + min_c[2]];
}

function place_note(index, max_index, first_chord, max_chord, sound_fn,
					min_color, max_color,
					min_b_color, max_b_color,
					min_glyph_color = PS.COLOR_BLACK, max_glyph_color = PS.COLOR_BLACK,
					min_b_glyph_color = PS.COLOR_BLACK, max_b_glyph_color = PS.COLOR_BLACK,
					long = false)
{
	if(index >= max_index + 1)
	{
		return false;
	}

	const sound = sound_fn(index);
	let sound_long = null;
	if(long)
	{
		sound_long = sound_fn(index, true);
	}

	const snd_array = sound.split("_");
	const note_array = snd_array[snd_array.length - 1].split("");

	const y_pos = parseInt(note_array[note_array.length - 1]) - first_chord;
	const color_ratio = y_pos / (max_chord - first_chord);

	let color, g_color, symbol;
	let offset = 0;

	if(note_array.length === 3) // Flat note
	{
		color = color_lerp(color_ratio, min_b_color, max_b_color);
		g_color = color_lerp(color_ratio, min_b_glyph_color, max_b_glyph_color);
		symbol = 0x25CF;
		offset = -1;
	}
	else
	{
		color = color_lerp(color_ratio, min_color, max_color);
		g_color = color_lerp(color_ratio, min_glyph_color, max_glyph_color);
		symbol = note_array[0].toUpperCase();
	}

	const x_pos = "c_d_ef_g_a_b".indexOf(note_array[0]) + offset;

	PS.color(x_pos, y_pos, color);
	PS.glyph(x_pos, y_pos, symbol);
	PS.glyphColor(x_pos, y_pos, g_color);

	PS.borderColor(x_pos, y_pos, g_color);
	PS.border(x_pos, y_pos, {top: 2, bottom: 2, left: 1, right: 1})

	PS.data(x_pos, y_pos, sound);
	PS.exec(x_pos, y_pos, playBeadSound);

	return index < max_index;
}

PS.init = function( system, options ) {
	PS.gridSize( 12, 9 );
	PS.gridColor(0xbfa98a);

	PS.statusText("🎶🎶🎶🎶🎶");
	PS.statusColor(PS.COLOR_WHITE);

	PS.audioLoad("fx_hoot");
	PS.audioLoad("fx_click");
	PS.audioLoad("fx_beep");
	PS.audioLoad("fx_bloop");
	PS.audioLoad("fx_rip");
	PS.audioLoad("fx_coin2");
	PS.audioLoad("fx_squish");

	recording = false;
	playing = false;

	time = 0;

	const delay = 2;
	const seconds = 8;
	max_time = seconds * (60 / delay);

	PS.timerStart(delay, playbackTimer);

	loadPage(0);
};


function loadPage(index)
{
	if(index === currentPage || recording)
	{
		PS.audioPlay("fx_hoot", {volume: 0.2});
		return;
	}

	let pg = pages[index];
	PS.gridSize(pg.grid_x, pg.grid_y);
	PS.gridColor(pg.bg_color)

	for(let i = 0; pg.generator_fn(i); i++);

	currentPage = index;

	//3C9B91

	loadEditor(pg.grid_x - 1, pg.grid_y - 1);

	PS.audioPlay("fx_click", {volume: 0.2})
}

function loadBeadPage(x, y, data)
{
	loadPage(x);
}

function playBeadSound(x, y, data)
{
	PS.audioPlay(data, {volume: pages[currentPage].volume});

	if(recording)
	{
		const audioObj = {audio: data, x: x, y: y};
		if (pages[currentPage].playback[time])
		{
			pages[currentPage].playback[time].push(audioObj);
		}
		else
		{
			pages[currentPage].playback[time] = [audioObj];
		}
	}
}

function loadEditor(x, y)
{
	let i;
	for(i = 0; i < pages.length; i++)
	{
		let p = pages[i];
		PS.color(i, y, p.icon_color);
		PS.glyph(i, y, p.icon_glyph);
		PS.glyphColor(i, y, p.icon_glyph_color);
		PS.radius(i, y, 20);
		PS.exec(i, y, loadBeadPage);
	}

	for(let c_x = 0; c_x <= x; c_x++)
	{
		for(let c_y = y-2; c_y <= y; c_y++)
		{
			if(c_y === y-2 || (c_x < x-4 && c_y === y-1) || (c_x < x-4 && c_x >= i && c_y === y))
			{
				PS.visible(c_x, c_y, false);
			}
		}
	}

	loadRadio(x, y);
}

function loadRadio(x, y)
{
	PS.color(x, y, 0x6b492c);
	PS.border(x, y, {left: 0, right: 2, bottom: 2, top: 2});
	PS.color(x-1, y, 0x6b492c);
	PS.border(x-1, y, {left: 0, right: 0, bottom: 2, top: 2});
	PS.color(x-2, y, 0x6b492c);
	PS.border(x-2, y, {left: 0, right: 0, bottom: 2, top: 2});
	PS.color(x-3, y, 0x6b492c);
	PS.border(x-3, y, {left: 0, right: 0, bottom: 2, top: 2});
	PS.color(x-4, y, 0x6b492c);
	PS.border(x-4, y, {left: 2, right: 0, bottom: 2, top: 2});

	PS.glyph(x, y-1, 0x23F6);
	PS.glyphColor(x, y-1, PS.COLOR_WHITE)
	PS.radius(x, y-1, 20);
	PS.color(x, y-1, 0x111111);
	PS.exec(x, y-1, volUp)

	PS.glyph(x, y, 0x23F8);
	PS.glyphColor(x, y, PS.COLOR_BLUE);
	PS.exec(x, y, pause);

	PS.glyph(x-1, y, 0x25B6);
	PS.glyphColor(x-1, y, PS.COLOR_GREEN);
	PS.exec(x-1, y, play);

	PS.glyph(x-2, y, 0x21E4);
	PS.glyphColor(x-2, y, PS.COLOR_YELLOW);
	PS.exec(x-2, y, rewind);

	PS.glyph(x-3, y, 0x25FC);
	PS.glyphColor(x-3, y, PS.COLOR_BLACK);
	PS.exec(x-3, y, stopPlayback);

	PS.glyph(x-4, y, 0x2B24);
	PS.glyphColor(x-4, y, PS.COLOR_RED);
	PS.exec(x-4, y, startRecording);

	PS.glyph(x-4, y-1, 0x23F7);
	PS.glyphColor(x-4, y-1, PS.COLOR_WHITE)
	PS.radius(x-4, y-1, 20);
	PS.color(x-4, y-1, 0x111111);
	PS.exec(x-4, y-1, volDown)

	PS.color(x-3, y-1, 0x050505)
	PS.border(x-3, y-1, {left: 2, right: 0, bottom: 2, top: 2});
	PS.color(x-2, y-1, 0x050505)
	PS.border(x-2, y-1, {left: 0, right: 0, bottom: 2, top: 2});
	setNumColor(PS.COLOR_GREEN);
	PS.color(x-1, y-1, 0x050505)
	PS.border(x-1, y-1, {left: 0, right: 2, bottom: 2, top: 2});
}

function startRecording(x, y, data)
{
	if(recording)
	{
		recording = false;
		PS.audioPlay("fx_boop", {volume: 0.2});
		return;
	}

	recording = true;
	setNumColor(PS.COLOR_RED);
	playing = true;

	pages[currentPage].playback[time] = null;

	PS.audioPlay("fx_beep", {volume: 0.3});
}

function rewind(x, y, data)
{
	if(recording)
	{
		return;
	}

	time = 0;

	PS.audioPlay("fx_rip", {volume: 0.1})
}

function volUp(x, y, data)
{
	pages[currentPage].volume += pages[currentPage].volume >= 1 ? 0 : 0.1;
	PS.audioPlay("fx_squish", {volume: pages[currentPage].volume});
}

function volDown()
{
	pages[currentPage].volume -= pages[currentPage].volume <= 0 ? 0 : 0.1;
	PS.audioPlay("fx_squish", {volume: pages[currentPage].volume});
}

function stopPlayback(x, y, data)
{
	time = 0;
	recording = false;
	setNumColor(PS.COLOR_GREEN);
	playing = false;

	PS.audioPlay("fx_coin2", {volume: 0.1})
}

function stopRecording(x, y, data)
{
	if(!recording)
	{
		return;
	}

	recording = false;
	setNumColor(PS.COLOR_GREEN);
	playing = false;
	time = 0;

	PS.audioPlay("fx_boop", {volume: 0.2});
}

function pause()
{
	if(recording)
	{
		return;
	}

	playing = false;
	PS.audioPlay("fx_blip", {volume: 0.1});
}

function play()
{
	if(recording)
	{
		return;
	}

	playing = true;
	PS.audioPlay("fx_blip", {volume: 0.1});
}

function setNumColor(col)
{
	PS.glyphColor(pages[currentPage].grid_x-3, pages[currentPage].grid_y-2, col);
}

function playbackTimer()
{
	const prog = time / 30;
	PS.glyph(pages[currentPage].grid_x-3, pages[currentPage].grid_y-2, Math.round(prog).toString())

	if(playing)
	{
		for(let i = 0; i < pages.length; i++)
		{
			const pg = pages[i];

			if(recording && i === currentPage && time < max_time)
			{
				pg.playback[time + 1] = null;
			}
			else if(pg.playback[time] && !(i === currentPage && recording))
			{
				const notes = pg.playback[time];
				for(let n = 0; n < notes.length; n++)
				{
					PS.audioPlay(notes[n].audio, {volume: pg.volume});

					// TODO: add cool fade effects if note being played is on this page
				}
			}
		}

		time++;

		if(time > max_time)
		{
			time = 0;
			if(recording)
			{
				stopRecording();
			}
		}
	}
}



PS.touch = function( x, y, data, options ) {

};


PS.release = function( x, y, data, options ) {

};


PS.enter = function( x, y, data, options ) {

};


PS.exit = function( x, y, data, options ) {

};


PS.exitGrid = function( options ) {

};


PS.keyDown = function( key, shift, ctrl, options ) {

};


PS.keyUp = function( key, shift, ctrl, options ) {

};

PS.input = function( sensors, options ) {

};

