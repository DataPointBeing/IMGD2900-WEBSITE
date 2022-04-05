
"use strict"; // Do NOT remove this directive!

const level_path = "levels/";

const level_files = [
    "1",
    "2",
    "3",
    "4",
    "5",
];


const level_grids = [];
const level_palettes = [];
let loaded = 0;

let player_color = PS.COLOR_BLACK;
let current_level = 0;

let game_active = false;
let player_pos = [0,0];
let goal_pos = [0,0];
let bg_color = PS.COLOR_BLACK;

let grid_x = 1;
let grid_y = 1;

let held = null;
let held_color = null;
let color_map = {};

let cursor_bead = [0,0];
	

PS.init = function( system, options ) {
    // Image loading function
    // Called when image loads successfully
    // [data] parameter will contain imageData

    PS.keyRepeat(true, 10, 10);

    PS.audioLoad("fx_chirp2");
    PS.audioLoad("fx_click");
    PS.audioLoad("fx_powerup7");
    PS.audioLoad("fx_tada");

    PS.gridSize(1, 1); // set initial size

    blackout(bg_color);

    PS.statusText("Loading...");
    PS.statusColor(PS.COLOR_WHITE);

    for(let i = 0; i < level_files.length; i++){
        let g = function(imageData){
            level_grids[i] = imageData;
            readyUp();
        }
        let p = function(imageData){
            level_palettes[i] = imageData;
            readyUp();
        }

        PS.imageLoad(level_path + level_files[i] + ".gif", g)
        PS.imageLoad(level_path + level_files[i] + "_pal.gif", p)
    }
};


PS.exit = function( x, y, data, options ) {

};

PS.exitGrid = function( options ) {
    unDragWall();
};

PS.keyDown = function( key, shift, ctrl, options ) {
    if(game_active) {
        switch (key) {
            case 0x77:
            case PS.KEY_ARROW_UP:
                playerMove([0,-1]);
                break;
            case 0x61:
            case PS.KEY_ARROW_LEFT:
                playerMove([-1,0]);
                break;
            case 0x64:
            case PS.KEY_ARROW_RIGHT:
                playerMove([1,0]);
                break;
            case 0x73:
            case PS.KEY_ARROW_DOWN:
                playerMove([0,1]);
                break;
            default:
                break;
        }
    }
};

PS.touch = function( x, y, data, options ) {
	
};

PS.enter = function( x, y, data, options ) {
    cursor_bead = [x, y];
};

PS.release = function( x, y, data, options ) {
	unDragWall();
};

function readyUp(){
    loaded++;
    if(loaded === level_files.length * 2) {
        PS.timerStart(5, mainLoop);
        PS.statusColor(PS.COLOR_BLACK);
        loadLevel();
        PS.statusText("");
    }
}

function blackout(color){
    PS.statusColor(color);
    PS.bgColor(PS.ALL, PS.ALL, color);
    PS.color(PS.ALL, PS.ALL, color);
    PS.borderColor(PS.ALL, PS.ALL, color);
    PS.border(PS.ALL, PS.ALL, 0);
    PS.gridColor(color);
}

function toggleFade(tf, func){
    if(tf){
        const fade = 80;
        PS.fade(PS.ALL, PS.ALL, fade);
        PS.borderFade(PS.ALL, PS.ALL, fade);
        PS.statusFade(fade);
        PS.gridFade(fade, {onEnd: func});
    }
    else {
        PS.fade(PS.ALL, PS.ALL, 0);
        PS.borderFade(PS.ALL, PS.ALL, 0);
        PS.statusFade(0);
        PS.gridFade(0, {onEnd: func});
    }
}

function getEmptyColor(pal){
    return PS.makeRGB(pal[0], pal[1], pal[2]);
}

function getWallColor(pal){
    return PS.makeRGB(pal[4], pal[5], pal[6]);
}

function getCharacterColor(pal){
    return PS.makeRGB(pal[8], pal[9], pal[10]);
}

function getTextColor(pal){
    return PS.makeRGB(pal[12], pal[13], pal[14]);
}

function getGoalColor(pal){
    return PS.makeRGB(pal[16], pal[17], pal[18]);
}


function loadLevel(){
    const pal = level_palettes[current_level];
    const grid = level_grids[current_level];

    grid_x = grid.width;
    grid_y = grid.height;
    PS.gridSize(grid_x, grid_y);

    blackout(bg_color - 20);

    const empty = getEmptyColor(pal.data);
    const wall = getWallColor(pal.data);
    const text = getTextColor(pal.data);

    toggleFade(true, startLevel);

    PS.color(PS.ALL, PS.ALL, empty);
    PS.gridColor(wall);
    PS.statusColor(text);

    PS.scale(PS.ALL, PS.ALL, 100);
    PS.radius(PS.ALL, PS.ALL, 0);
    PS.glyph(PS.ALL, PS.ALL, 0);

    PS.data(PS.ALL, PS.ALL, 0);

    color_map = {};
}

function startLevel(){
    toggleFade(false);

    const pal = level_palettes[current_level];
    const pal_dat = pal.data;
    const grid = level_grids[current_level];
    const grid_dat = grid.data;

    const empty = getEmptyColor(pal_dat);
    const character = getCharacterColor(pal_dat);
    const wall = getWallColor(pal_dat);
    const text = getTextColor(pal_dat);
    const goal = getGoalColor(pal_dat);

    bg_color = empty;

    for(let x = 0; x < grid.width; x++){
        for(let y = 0; y < grid.height; y++){
            const col_ind = (x + (y*grid.width)) * 4;
            const this_col = PS.makeRGB(grid_dat[col_ind], grid_dat[col_ind+1], grid_dat[col_ind+2]);
            switch(this_col){
                case empty:
                    break;
                case character:
                    playerBead(x, y, character);
                    player_pos = [x, y];
                    break;
                case wall:
                    wallBead(x, y, wall);
                    break;
                case goal:
                    goalBead(x, y, character);
                    goal_pos = [x, y];
                    break;
                default:
                    slideBarrierBead(x, y, this_col, text);
                    if(color_map[this_col]){
                        color_map[this_col].beads.push([x, y]);
                    }
                    else{
                        color_map[this_col] = {beads: [[x, y]], directions: [[0,1], [0,-1], [1,0], [-1,0]]};
                    }
                    break;
            }
        }
    }

    for(let y = 1; y < pal.height; y++){
        const dir_ind = (y*pal.width) * 4;
        const dir_col = PS.makeRGB(pal_dat[dir_ind], pal_dat[dir_ind+1], pal_dat[dir_ind+2]);
        const dirs = directionsFromColor(dir_col);
        if(dirs) {
            for (let x = 1; x < pal.width; x++) {
                const col_ind = (x + (y*pal.width)) * 4;
                const this_col = PS.makeRGB(pal_dat[col_ind], pal_dat[col_ind+1], pal_dat[col_ind+2]);
                if(color_map[this_col] && pal_dat[col_ind+3] === 255){
                    color_map[this_col].directions = dirs.dirs;
                    for(let bd of color_map[this_col].beads){
                        PS.glyph(bd[0], bd[1], dirs.glyph);
                    }
                }
                else{
                    break;
                }
            }
        }
    }

    PS.bgColor(PS.ALL, PS.ALL, empty);
    PS.bgAlpha(PS.ALL, PS.ALL, 255);

    game_active = true;
}

function directionsFromColor(col){
    switch(col){
        case 0xFF0000:              // RED = UP
            return {glyph: 0x2191, dirs: [[0,-1]]};
        case 0x00FF00:              // GREEN = DOWN
            return {glyph: 0x2193, dirs: [[0,1]]};
        case 0x0000FF:              // BLUE = LEFT
            return {glyph: 0x2190, dirs: [[-1,0]]};
        case 0xFFFF00:              // YELLOW = RIGHT
            return {glyph: 0x2192, dirs: [[1,0]]};
        case 0x00FFFF:              // CYAN = UP/DOWN
            return {glyph: 0x2B81, dirs: [[0,-1],[0,1]]};
        case 0xFF00FF:              // MAGENTA = LEFT/RIGHT
            return {glyph: 0x2B80, dirs: [[-1,0],[1,0]]};
        default:
            return null;
    }
}

function playerMove(vec){
    if(player_pos[0] + vec[0] === goal_pos[0] && player_pos[1] + vec[1] === goal_pos[1]){
        // level beaten
        beatLevel();
    }
    else {
        player_pos = moveEntity(player_pos[0], player_pos[1], vec);
    }
}

function beatLevel(){
    PS.audioPlay("fx_powerup7", {volume: 0.2});

    held = null;
    held_color = null;

    game_active = false;
    emptyBead(PS.ALL, PS.ALL);
    current_level++;
    toggleFade(true, fadeTransition);
    PS.statusText("");
    blackout(bg_color);

    color_map = {};
}

function fadeTransition(){
    toggleFade(false, null);
    if(current_level < level_files.length) {
        loadLevel();
    }
    else{
        PS.audioPlay("fx_tada", {volume: 0.3});
    }
}

function moveEntity(x, y, vec, check_others = false){
    let pos = [x, y];

    //PS.debug("move?\n");

    let check = [];
    let my_color;
    if(check_others){
        check = color_map[held_color].beads;
        my_color = held_color;
    }
    else {
        check.push(pos);
        my_color = PS.color(x, y);
    }

    for(let i = 0; i < check.length; i++){
        const x_o = check[i][0] + vec[0];
        const y_o = check[i][1] + vec[1];
        if(x_o >= grid_x || y_o >= grid_y || x_o < 0 || y_o < 0 || (PS.data(x_o, y_o) === 1 && PS.color(x_o, y_o) !== my_color)){
            // Can't move
            //PS.debug("no move to " + x_o + " " + y_o + "\n")
            //PS.debug(grid_x + "\n")
            //PS.debug(grid_y + "\n")
            return pos;
        }
    }

    //PS.debug("MOVED!\n")

    // We can move
    pos = [x + vec[0], y + vec[1]];

    let done_ct = 0;
    let done = [];
    let new_pos = [];
    while(done_ct < check.length) {
        for (let i = 0; i < check.length; i++) {
            const x_o = check[i][0] + vec[0];
            const y_o = check[i][1] + vec[1];
            //PS.debug("attempting move\n");
            if((done.includes(check[i][0] + "," + check[i][1])) || PS.color(x_o, y_o) === my_color){
                continue;
            }
            moveBead(check[i][0], check[i][1], x_o, y_o);
            done.push(check[i][0] + "," + check[i][1]);
            new_pos.push([x_o, y_o]);
            done_ct++;
        }
    }

    if(check_others){
        color_map[held_color].beads = new_pos;
    }

    return pos;
}

function moveBead(x, y, x_o, y_o){
    PS.radius(x_o, y_o, PS.radius(x,y));
    PS.scale(x_o, y_o, PS.scale(x,y));
    PS.border(x_o, y_o, PS.border(x,y));

    PS.borderColor(x_o, y_o, PS.borderColor(x,y));
    PS.glyphColor(x_o, y_o, PS.glyphColor(x,y))
    PS.color(x_o, y_o, PS.color(x,y));

    PS.glyph(x_o, y_o, PS.glyph(x,y));

    PS.data(x_o, y_o, PS.data(x,y));
    PS.exec(x_o, y_o, PS.exec(x,y,PS.CURRENT)? PS.exec(x,y) : PS.DEFAULT);

    emptyBead(x, y);
}

function emptyBead(x, y){
    PS.radius(x, y, 0);
    PS.scale(x, y, 100);
    PS.border(x, y, 0);
    PS.borderColor(x, y, bg_color);
    PS.color(x, y, bg_color);

    PS.glyph(x, y, 0);

    PS.data(x, y, 0);
    PS.exec(x, y, PS.DEFAULT);
}

function playerBead(x, y, col){
    PS.radius(x, y, 50);
    PS.scale(x, y, 73);
    PS.border(x, y, 0);
    PS.borderColor(x, y, col);
    PS.color(x, y, col);

    PS.data(x, y, 1);
}

function goalBead(x, y, col, bgCol){
    PS.radius(x, y, 50);
    PS.scale(x, y, 80);
    PS.border(x, y, 4);
    PS.borderColor(x, y, col);
    PS.color(x, y, bgCol);

    PS.data(x, y, 1);
}

function slideBarrierBead(x, y, col, txCol){
    PS.radius(x, y, 20);
    PS.scale(x, y, 100);
    PS.border(x, y, 0);
    PS.borderColor(x, y, col);
    PS.color(x, y, col);

    PS.glyph(x, y, 0x2725);
    PS.glyphColor(x, y, txCol);

    PS.data(x, y, 1);
    PS.exec(x, y, dragWall);
}

function wallBead(x, y, col){
    PS.radius(x, y, 0);
    PS.scale(x, y, 100);
    PS.border(x, y, 0);
    PS.borderColor(x, y, col);
    PS.color(x, y, col);

    PS.data(x, y, 1);
}

function dragWall(x, y, data){
    held = [x, y];
    held_color = PS.color(x, y);
    PS.audioPlay("fx_click", {volume: 0.1})
}

function unDragWall(){
    if(held){
        PS.audioPlay("fx_chirp2", {volume: 0.1})
    }
    held = null;
    held_color = null;
}

function mainLoop() {
    //PS.debug("update");
    if(game_active && held){
        let vec = [cursor_bead[0] - held[0], cursor_bead[1] - held[1]];
        vec = [vec[0] === 0? 0 : (vec[0] / Math.abs(vec[0])), vec[1] === 0? 0 :(vec[1] / Math.abs(vec[1]))];

        const dirs = color_map[held_color].directions;
        const possible_dirs = [];

        for(let i = 0; i < dirs.length; i++){
            if((dirs[i][0] === vec[0] && dirs[i][0] !== 0)|| (dirs[i][1] === vec[1] && dirs[i][1] !== 0)){
                possible_dirs.push(dirs[i]);
            }
        }

        for(let i = 0, r = PS.random(100); i < possible_dirs.length; i++){
            const i_r = (i + r)%possible_dirs.length;
            const move = moveEntity(held[0], held[1], possible_dirs[i_r], true);
            if(move[0] !== held[0] || move[1] !== held[1]){
                held = move;
                break;
            }
        }
    }
}