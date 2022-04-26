"use strict"; // Do NOT remove this directive!

PS.init = function(system, options) {
    PS.keyRepeat(true, 2, 2);

    PS.audioLoad("fx_tada");
    PS.audioLoad("fx_blip");
    PS.audioLoad("fx_beep");

    PS.audioLoad("fx_powerup7");
    PS.audioLoad("fx_coin3");
    PS.audioLoad("fx_shoot8");
    PS.audioLoad("fx_hoot");

    GB.Clock.startLoop();

    initItemMakers();
    initConduitMakers();
    GB.LevelLoader.loadTheseLevels(["easter_eggs_level2"], levelOne);

};

function initConduitMakers() {
    // CORAL: Sends a signal when all that have this conduit are ACTIVE.
    GB.LevelLoader.registerConduit(0xFF5099, function(x, y, cxn) {
        return GB.Conduit.get(AllActiveConduit, cxn);
    });

    // POWDER BLUE: Sends a signal when the three buttons with this conduit are hit in the specified order...
    GB.LevelLoader.registerConduit(0x8baad4, function(x, y, cxn) {
        return GB.Conduit.get(PressOrderConduit, cxn, [
            0x666600,
            0x666600,
            0x660000,
            0x660000,
            0x006666,
            0x666600,
            0x660000
        ]);
    });

    // GOLDENROD: Changes the room name (INITIAL DOORWAY)
    GB.LevelLoader.registerConduit(0xD0A300, function(x, y, cxn) {
        return GB.Conduit.get(RoomNameConduit, 0xD0A300, "The Boring Room", "The Realm of the Shrubbery");
    });

    // HOT PINK: Changes the room name (DOORWAY: 3 LAMPS to DEATH PATHS)
    GB.LevelLoader.registerConduit(0xFF2BD0, function(x, y, cxn) {
        return GB.Conduit.get(RoomNameConduit, 0xFF2BD0, "Three Lamps", "Deathly Pathways");
    });

    // BROWN: Changes the room name (DOORWAY: SHRUBBERY to 3 LAMPS)
    GB.LevelLoader.registerConduit(0x5E2B09, function(x, y, cxn) {
        return GB.Conduit.get(RoomNameConduit, 0x5E2B09, "The Realm of the Shrubbery", "Three Lamps");
    });

    // PALE PINK: Changes the room name (DOORWAY: DEATH PATHS to LOCKSPORT)
    GB.LevelLoader.registerConduit(0xCE8B86, function(x, y, cxn) {
        return GB.Conduit.get(RoomNameConduit, 0xCE8B86, "Deathly Pathways", "Locksport");
    });

    // SALMON: Changes the room name (DOORWAY: LOCKSPORT to QUAD CANDLES)
    GB.LevelLoader.registerConduit(0xFF5548, function(x, y, cxn) {
        return GB.Conduit.get(RoomNameConduit, 0xFF5548, "Locksport", "Quad Candles");
    });

    // BLUE-GRAY: Changes the room name (DOORWAY: QUAD CANDLES to WINNERS' GRIN)
    GB.LevelLoader.registerConduit(0x3F3B4E, function(x, y, cxn) {
        return GB.Conduit.get(RoomNameConduit, 0x3F3B4E, "Quad Candles", "The Winner's Grin");
    });

    // NAVY: Changes the room name (DOORWAY: 3 LAMPS to ???)
    GB.LevelLoader.registerConduit(0x000080, function(x, y, cxn) {
        return GB.Conduit.get(RoomNameConduit, 0x000080, "Three Lamps", "???");
    });

    // DARK FUSCHIA: Changes the room name (DOORWAY: ??? to LOCKSPORT)
    GB.LevelLoader.registerConduit(0x80003E, function(x, y, cxn) {
        return GB.Conduit.get(RoomNameConduit, 0x80003E, "???", "Locksport");
    });
}

function initItemMakers() {

    // YELLOW: Player!
    GB.LevelLoader.registerItem(0xFFFF00, function(x, y, cxn) {
        return [new Player(x, y)];
    });

    // RED: Regular vertical doorway
    GB.LevelLoader.registerItem(0xFF0000, function(x, y, cxn) {
        return [
            // UP
            new Doorway(
                {x:x,y:y},
                {x:x+1,y:y+1},
                {x:x+1-(8), y:y+1-16},
                {x:x+1-(8), y:y+2},
                false
            ),
            // DOWN
            new Doorway(
                {x:x,y:y+1},
                {x:x+1,y:y+2},
                {x:x+1-(8), y:y+2},
                {x:x+1-(8), y:y+1-16},
                true
            )
        ];
    });

    // LIGHT RED: Upper left secret horizontal doorway (with wall)
    GB.LevelLoader.registerItem(0xCE3333, function(x, y, cxn, add) {
        new MobileWall(x, y, cxn, false, true, add, 0);
        return [
            // UP
            new Doorway(
                {x:x,y:y},
                {x:x+1,y:y+1},
                {x:x+1-(8-3), y:y+1-7},
                {x:x+1-(8-3), y:y+2},
                false,
                {x: 7, y: 7},
                {x: 16, y: 16}
            ),
            // DOWN
            new Doorway(
                {x:x,y:y+1},
                {x:x+1,y:y+2},
                {x:x+1-(8-3), y:y+2},
                {x:x+1-(8-3), y:y+1-7},
                true,
                {x: 16, y: 16},
                {x: 7, y: 7}
            )
        ];
    });

    // BLUE: Regular horizontal doorway
    GB.LevelLoader.registerItem(0x0000FF, function(x, y, cxn) {
        return [
            // LEFT
            new Doorway(
                {x:x,y:y},
                {x:x+1,y:y+1},
                {x:x+1-16, y:y+1-(8)},
                {x:x+2, y:y+1-(8)},
                false
            ),
            // RIGHT
            new Doorway(
                {x:x+1,y:y},
                {x:x+2,y:y+1},
                {x:x+2, y:y+1-(8)},
                {x:x+1-16, y:y+1-(8)},
                true
            )
        ];
    });

    // LIGHT BLUE: Lower right secret horizontal doorway (with wall)
    GB.LevelLoader.registerItem(0x338DCE, function(x, y, cxn, add) {
        new MobileWall(x, y, cxn, false, true, add, 0);
        return [
            // LEFT
            new Doorway(
                {x:x,y:y},
                {x:x+1,y:y+1},
                {x:x+1-16, y:y+1-(8+3)},
                {x:x+2, y:y+1-(2)},
                false,
                {x: 16, y: 16},
                {x:7, y:7}
            ),
            // RIGHT
            new Doorway(
                {x:x+1,y:y},
                {x:x+2,y:y+1},
                {x:x+2, y:y+1-(2)},
                {x:x+1-16, y:y+1-(8+3)},
                true,
                {x:7, y:7},
                {x: 16, y: 16}
            )
        ];
    });

    // MAGENTA: Death zone (kills the player when they step into it)
    GB.LevelLoader.registerItem(0xFF00FF, function(x, y) {
        return [new DeathZone({x:x,y:y}, {x:x,y:y})];
    });

    // GREEN: Button
    GB.LevelLoader.registerItem(0x00FF00, function(x, y, cxn, add) {
        return [new Button(x, y, cxn, false, add === 0x000000? PS.COLOR_RED : add)];
    });

    // DARK GREEN: Invisible button
    GB.LevelLoader.registerItem(0x007400, function(x, y, cxn) {
        const button = new Button(x, y, cxn, true, 0x000000, "fx_beep", 0.5);
        new Invisibility(button);
        return [button];
    });

    // CYAN: Disappearing wall (toggleable)
    GB.LevelLoader.registerItem(0x00FFFF, function(x, y, cxn) {
        return [new MobileWall(x, y, cxn)];
    });

    // CERULEAN: Disappearing wall (not toggleable)
    GB.LevelLoader.registerItem(0x006DD0, function(x, y, cxn) {
        return [new MobileWall(x, y, cxn, false)];
    });

    // Indigo: Disappearing wall with color from ADDITIONAL and no radius (not toggleable)
    GB.LevelLoader.registerItem(0x2700CF, function(x, y, cxn, add) {
        return [new MobileWall(x, y, cxn, false, true, add, 0)];
    });

    // SEAFOAM: Disappearing wall (toggleable, starts OFF, color from ADDITIONAL)
    GB.LevelLoader.registerItem(0x00AA66, function(x, y, cxn, add) {
        return [new MobileWall(x, y, cxn, true, false, add)];
    });

    // SIENNA: Indicator light, tuned to CONNECTION and colored by ADD
    GB.LevelLoader.registerItem(0xFFAA66, function(x, y, cxn, add) {
        return [new TriLightBulb(x, y, cxn, false, add)];
    });

    // LIGHT ORANGE: Victory zone, you win when you reach one of these.
    GB.LevelLoader.registerItem(0xFFAA00, function(x, y) {
        return [new VictoryZone({x:x, y:y}, {x:x+1, y:y})];
    });

    // DARK GRAY: Camera starting point, collision.
    GB.LevelLoader.registerItem(0x696969, function(x, y) {
        GB.View.setPosition({x:x, y:y});
        GB.World.setCollisionSquare(x, y, true);
        return [];
    });

    // LIGHT GRAY: Camera starting point, no collision.
    GB.LevelLoader.registerItem(0x969696, function(x, y) {
        GB.View.setPosition({x:x, y:y});
        GB.World.setCollisionSquare(x, y, false);
        return [];
    });

    // BURNT ORANGE: Key, with CONNECTION as color
    GB.LevelLoader.registerItem(0xE58709, function(x, y, cxn) {
        return [new Key(x, y, cxn)];
    });

    // BEIGE: Lock, with CONNECTION as color
    GB.LevelLoader.registerItem(0x9B7B4F, function(x, y, cxn) {
        return [new LockBlock(x, y, cxn)];
    });
}

function levelOne() {
    GB.LevelLoader.buildLevel("easter_eggs_level2");
}

PS.keyDown = function( key, shift, ctrl, options ) {
    GB.Input.processInput(key, true);
};

PS.keyUp = function( key, shift, ctrl, options ) {
    GB.Input.processInput(key, false);
};