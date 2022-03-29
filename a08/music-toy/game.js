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

let notes_in_progress = {};

let pages = [
	{ // PIANO
		grid_x: 12,
		grid_y: 12,

		icon_color: 0x6f6f6b,
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

		icon_color: 0xffd987,
		icon_glyph: 0x2A8D,
		icon_glyph_color: 0xFFB120,

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

		icon_color: 0xc95d78,
		icon_glyph: 0x2A73,
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
	{ // DRUMS
		grid_x: 12,
		grid_y: 8,

		icon_color: 0xd79000,
		icon_glyph: 0x29BF,
		icon_glyph_color: 0xffa256,

		bg_color: 0xd76200,

		generator_fn: function(index)
		{
			const perc_array = [
				{
					x_base: 0,
					y_base: 0,
					sound_str: "perc_drum_",
					suffix_list: ["snare", "bass"],
					symbol: 0x03D8,
					min_color: [0xFF, 0xC7, 0x56],
					max_color: [0xA8, 0x70, 0x00],
					min_glyph_color: [0xff, 0xa2, 0x56],
					max_glyph_color: [0xff, 0xa2, 0x56]
				},
				{
					x_base: 2,
					y_base: 0,
					sound_str: "perc_drum_tom",
					suffix_list: [1, 2, 3, 4],
					symbol: 0x047A,
					min_color: [0xFF, 0xC7, 0x56],
					max_color: [0xA8, 0x70, 0x00],
					min_glyph_color: [0xff, 0xa2, 0x56],
					max_glyph_color: [0xff, 0xa2, 0x56]
				},
				{
					x_base: 6,
					y_base: 0,
					sound_str: "perc_cymbal_crash",
					suffix_list: [4, 1, 2, 3],
					symbol: 0x274D,
					min_color: [0xFF, 0xC7, 0x56],
					max_color: [0xA8, 0x70, 0x00],
					min_glyph_color: [0xff, 0xa2, 0x56],
					max_glyph_color: [0xff, 0xa2, 0x56]
				},
				{
					x_base: 10,
					y_base: 0,
					sound_str: "perc_cymbal_",
					suffix_list: ["ride"],
					symbol: 0x03EC,
					min_color: [0xFF, 0xC7, 0x56],
					max_color: [0xA8, 0x70, 0x00],
					min_glyph_color: [0xff, 0xa2, 0x56],
					max_glyph_color: [0xff, 0xa2, 0x56]
				},
				{
					x_base: 0,
					y_base: 1,
					sound_str: "perc_hihat_",
					suffix_list: ["closed", "open", "pedal"],
					symbol: 0x0433,
					min_color: [0xFF, 0xC7, 0x56],
					max_color: [0xA8, 0x70, 0x00],
					min_glyph_color: [0xff, 0xa2, 0x56],
					max_glyph_color: [0xff, 0xa2, 0x56]
				},
				{
					x_base: 6,
					y_base: 1,
					sound_str: "perc_bongo_",
					suffix_list: ["low", "high"],
					symbol: 0x0239,
					min_color: [0xFF, 0xC7, 0x56],
					max_color: [0xA8, 0x70, 0x00],
					min_glyph_color: [0xff, 0xa2, 0x56],
					max_glyph_color: [0xff, 0xa2, 0x56]
				},
				{
					x_base: 0,
					y_base: 2,
					sound_str: "perc_conga_",
					suffix_list: ["low", "high"],
					symbol: 0x047B,
					min_color: [0xFF, 0xC7, 0x56],
					max_color: [0xA8, 0x70, 0x00],
					min_glyph_color: [0xff, 0xa2, 0x56],
					max_glyph_color: [0xff, 0xa2, 0x56]
				},
				{
					x_base: 6,
					y_base: 2,
					sound_str: "perc_block_",
					suffix_list: ["low", "high"],
					symbol: 0x2752,
					min_color: [0xFF, 0xC7, 0x56],
					max_color: [0xA8, 0x70, 0x00],
					min_glyph_color: [0xff, 0xa2, 0x56],
					max_glyph_color: [0xff, 0xa2, 0x56]
				},
				{
					x_base: 0,
					y_base: 3,
					sound_str: "perc_cowbell_",
					suffix_list: ["low", "high"],
					symbol: 0x0434,
					min_color: [0xFF, 0xC7, 0x56],
					max_color: [0xA8, 0x70, 0x00],
					min_glyph_color: [0xff, 0xa2, 0x56],
					max_glyph_color: [0xff, 0xa2, 0x56]
				},
				{
					x_base: 6,
					y_base: 3,
					sound_str: "perc_shaker",
					suffix_list: [""],
					symbol: 0x03AA,
					min_color: [0xFF, 0xC7, 0x56],
					max_color: [0xA8, 0x70, 0x00],
					min_glyph_color: [0xff, 0xa2, 0x56],
					max_glyph_color: [0xff, 0xa2, 0x56]
				},
				{
					x_base: 0,
					y_base: 4,
					sound_str: "perc_tambourine",
					suffix_list: [""],
					symbol: 0x29BB,
					min_color: [0xFF, 0xC7, 0x56],
					max_color: [0xA8, 0x70, 0x00],
					min_glyph_color: [0xff, 0xa2, 0x56],
					max_glyph_color: [0xff, 0xa2, 0x56]
				},
				{
					x_base: 6,
					y_base: 4,
					sound_str: "perc_triangle",
					suffix_list: [""],
					symbol: 0x0394,
					min_color: [0xFF, 0xC7, 0x56],
					max_color: [0xA8, 0x70, 0x00],
					min_glyph_color: [0xff, 0xa2, 0x56],
					max_glyph_color: [0xff, 0xa2, 0x56]
				}
			]

			for(let i = 0; i < perc_array.length; i++)
			{
				for(let gen = 0; place_note_perc(gen, perc_array[i]); gen++);
			}

			return false;
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

	let sound, snd_array, ex;
	if(long)
	{
		sound = {};
		sound.long = sound_fn(index, true);
		sound.short = sound_fn(index);
		PS.audioLoad(sound.long);
		PS.audioLoad(sound.short);
		ex = playBeadLongShort;
		snd_array = sound.short.split("_");
	}
	else
	{
		sound = sound_fn(index);
		PS.audioLoad(sound);
		ex = playBeadSound;
		snd_array = sound.split("_");
	}

	const note_array = snd_array[snd_array.length - 1].split("");

	const y_pos = parseInt(note_array[note_array.length - 1]) - first_chord;
	const color_ratio = (max_chord-first_chord) > 0? y_pos / (max_chord - first_chord) : 0.5;

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
	PS.exec(x_pos, y_pos, ex);

	return index < max_index;
}

function place_note_perc(index, perc_params)
{
	const max_index = perc_params.suffix_list.length - 1

	if(index >= max_index + 1)
	{
		return false;
	}

	const sound = perc_params.sound_str + perc_params.suffix_list[index];
	PS.audioLoad(sound);

	const color_ratio = max_index > 0 ? index / max_index : 0.5;

	let color, g_color;
	color = color_lerp(color_ratio, perc_params.min_color, perc_params.max_color);
	g_color = color_lerp(color_ratio, perc_params.min_glyph_color, perc_params.max_glyph_color);
	const x_pos = perc_params.x_base + index;

	PS.color(x_pos, perc_params.y_base, color);
	PS.glyph(x_pos, perc_params.y_base, perc_params.symbol);
	PS.glyphColor(x_pos, perc_params.y_base, g_color);

	PS.borderColor(x_pos, perc_params.y_base, g_color);
	PS.border(x_pos, perc_params.y_base, {top: 2, bottom: 2, left: 1, right: 1})

	PS.data(x_pos, perc_params.y_base, sound);
	PS.exec(x_pos, perc_params.y_base, playBeadSound);

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

	for(let gen = 0; pg.generator_fn(gen); gen++);

	currentPage = index;

	loadEditor(pg.grid_x - 1, pg.grid_y - 1);

	for (const [key, value] of Object.entries(notes_in_progress)) {
		PS.timerStop(value);
		delete notes_in_progress[key];
	}

	PS.audioPlay("fx_click", {volume: 0.2})
}

function loadBeadPage(x, y, data)
{
	loadPage(x);
}

function noteFade(x, y, blipColor)
{
	let col = PS.color(x, y);
	PS.fade(x, y, 0);
	PS.color(x, y, blipColor);
	PS.fade(x, y, 120);
	PS.color(x, y, col);
}

function mixerFade(x, y, blipColor)
{
	let col = PS.glyphColor(x, y);
	PS.glyphFade(x, y, 0);
	PS.glyphColor(x, y, blipColor);
	PS.glyphFade(x, y, 30);
	PS.glyphColor(x, y, col);
}

function playBeadLongShort(x, y, data)
{
	notes_in_progress[x + (y*pages[currentPage].grid_x)] = PS.timerStart(9, noteLengthTimer, x, y, data);
}

function noteLengthTimer(x, y, data)
{
	const np = x + (y*pages[currentPage].grid_x);
	playBeadSound(x, y, data.long);
	PS.timerStop(notes_in_progress[np]);
	delete notes_in_progress[np];
}

function cutNote(x, y, data)
{
	const np = x + (y*pages[currentPage].grid_x);
	if(notes_in_progress[np])
	{
		playBeadSound(x, y, data.short);
		PS.timerStop(notes_in_progress[np]);
		delete notes_in_progress[np];
	}
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
		noteFade(x, y, 0xFF0000);
	}
	else
	{
		noteFade(x, y, 0xFFFFFF);
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
		setNumColor(PS.COLOR_GREEN);
		mixerFade(x, y, PS.COLOR_WHITE);
		return;
	}

	recording = true;
	setNumColor(PS.COLOR_RED);
	playing = true;

	delete pages[currentPage].playback[time];

	PS.audioPlay("fx_beep", {volume: 0.3});
	mixerFade(x, y, PS.COLOR_WHITE);
}

function rewind(x, y, data)
{
	if(recording)
	{
		return;
	}

	time = 0;

	PS.audioPlay("fx_rip", {volume: 0.1})
	mixerFade(x, y, PS.COLOR_WHITE);
}

function volUp(x, y, data)
{
	pages[currentPage].volume += pages[currentPage].volume >= 1 ? 0 : 0.1;
	PS.audioPlay("fx_squish", {volume: pages[currentPage].volume});
	mixerFade(x, y, PS.COLOR_BLACK);
}

function volDown(x, y, data)
{
	pages[currentPage].volume -= pages[currentPage].volume <= 0 ? 0 : 0.1;
	PS.audioPlay("fx_squish", {volume: pages[currentPage].volume});
	mixerFade(x, y, PS.COLOR_BLACK);
}

function stopPlayback(x, y, data)
{
	time = 0;
	recording = false;
	setNumColor(PS.COLOR_GREEN);
	playing = false;

	PS.audioPlay("fx_coin2", {volume: 0.1})
	mixerFade(x, y, PS.COLOR_WHITE);
}

function stopRecording()
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

function pause(x, y, data)
{
	if(recording)
	{
		return;
	}

	playing = false;
	PS.audioPlay("fx_blip", {volume: 0.1});
	mixerFade(x, y, PS.COLOR_WHITE);
}

function play(x, y, data)
{
	if(recording)
	{
		return;
	}

	playing = true;
	PS.audioPlay("fx_blip", {volume: 0.1});
	mixerFade(x, y, PS.COLOR_WHITE);
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
				delete pg.playback[time + 1];
			}
			else if(pg.playback[time] && !(i === currentPage && recording))
			{
				const notes = pg.playback[time];
				for(let n = 0; n < notes.length; n++)
				{
					PS.audioPlay(notes[n].audio, {volume: pg.volume});

					if(i === currentPage)
					{
						noteFade(notes[n].x, notes[n].y, 0x00FF00);
					}
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
	cutNote(x, y, data);
};


PS.enter = function( x, y, data, options ) {

};


PS.exit = function( x, y, data, options ) {
	cutNote(x, y, data);
};


PS.exitGrid = function( options ) {

};


PS.keyDown = function( key, shift, ctrl, options ) {

};


PS.keyUp = function( key, shift, ctrl, options ) {

};

PS.input = function( sensors, options ) {

};

