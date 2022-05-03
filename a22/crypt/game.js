// Cave sounds: provided by Zapsplat.com

"use strict"; // Do NOT remove this directive!

PS.init = function(system, options) {
    PS.keyRepeat(true, 2, 2);

    PS.audioLoad("fx_tada");
    PS.audioLoad("fx_blip");
    PS.audioLoad("fx_beep");

    PS.audioLoad("fx_powerup7");
    PS.audioLoad("fx_coin1");
    PS.audioLoad("fx_coin3");
    PS.audioLoad("fx_shoot8");
    PS.audioLoad("fx_hoot");
    PS.audioLoad("fx_wilhelm");

    PS.audioLoad("cave_loop", {path: "sounds/", fileTypes: ["wav"]});

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

    // ORANGE: May send a teleport signal when this TELE-DOORWAY is newly entered. ("Lost Woods logic" variant)
    GB.LevelLoader.registerConduit(0xFF7120, function(x, y, cxn) {
        return GB.Conduit.get(LostWoodsConduit, cxn, [
            0x65484d,
            0xe5c462,
            0xe78bff,
            0x8b7120
        ]);
    });

    // UNRIPE ORANGE: Sends a teleport signal when this TELE-DOORWAY is newly entered.
    GB.LevelLoader.registerConduit(0xFFA154, function(x, y, cxn) {
        return GB.Conduit.get(TeleDoorConduit, cxn);
    });

    // GOLDENROD: Changes the room name (INITIAL DOORWAY)
    GB.LevelLoader.registerConduit(0xD0A300, function(x, y, cxn) {
        return GB.Conduit.get(RoomNameConduit, 0xD0A300, "The Boring Room", "The Realm of the Shrubbery");
    });

    // BROWN: Changes the room name (DOORWAY: SHRUBBERY to 3 LAMPS)
    GB.LevelLoader.registerConduit(0x5E2B09, function(x, y, cxn) {
        return GB.Conduit.get(RoomNameConduit, 0x5E2B09, "The Realm of the Shrubbery", "Three Lamps");
    });

    // SALMON: Changes the room name (DOORWAY: LOCKSPORT to QUAD CANDLES)
    GB.LevelLoader.registerConduit(0xFF5548, function(x, y, cxn) {
        return GB.Conduit.get(RoomNameConduit, 0xFF5548, "Locksport", "Quad Candles");
    });

    // BLUE-GRAY: Changes the room name (DOORWAY: QUAD CANDLES to GROTTO)
    GB.LevelLoader.registerConduit(0x3F3B4E, function(x, y, cxn) {
        return GB.Conduit.get(RoomNameConduit, 0x3F3B4E,  "The Murmuring Grotto", "Quad Candles");
    });

    // SUPER PINK: Changes the room name (DOORWAY: GROTTO to PENULTIMATE)
    GB.LevelLoader.registerConduit(0xFC18B9, function(x, y, cxn) {
        return GB.Conduit.get(RoomNameConduit, 0xFC18B9, "Penultimate Sconces", "The Murmuring Grotto");
    });

    // CHAMOMILE: Changes the room name (DOORWAY: PENULTIMATE to ???)
    GB.LevelLoader.registerConduit(0xBBD081, function(x, y, cxn) {
        return GB.Conduit.get(RoomNameConduit, 0xBBD081, "???", "Penultimate Sconces");
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

    // PEACH: Final path top entrance
    GB.LevelLoader.registerItem(0xBF7751, function(x, y, cxn) {
        return [
            // UP
            new Doorway(
                {x:x,y:y},
                {x:x+1,y:y},
                {x:x+1-(8), y:y+1-16},
                {x:x-(3), y:y+2},
                false,
                {x: 16, y: 16},
                {x: 7, y:7}
            ),
            // DOWN
            new Doorway(
                {x:x,y:y+2},
                {x:x+1,y:y+2},
                {x:x+1-(8), y:y+2},
                {x:x+1-(8), y:y+1-16},
                true,
                {x: 7, y:7},
                {x: 16, y: 16}
            )
        ];
    });

    // PEACH II: Final path exit
    GB.LevelLoader.registerItem(0xBF6751, function(x, y, cxn) {
        return [
            // UP
            new Doorway(
                {x:x,y:y},
                {x:x+1,y:y},
                {x:x-4, y:y-6},
                {x:x+1-(8), y:y+2},
                false,
                {x: 7, y: 7},
                {x: 16, y: 16}
            ),
            // DOWN
            new Doorway(
                {x:x,y:y+2},
                {x:x+1,y:y+2},
                {x:x+1-(8), y:y+2},
                {x:x-3, y:y-6},
                true,
                {x: 16, y: 16},
                {x: 7, y:7}
            )
        ];
    });

    // RED: Regular vertical doorway
    GB.LevelLoader.registerItem(0xFF0000, function(x, y, cxn) {
        return [
            // UP
            new Doorway(
                {x:x,y:y},
                {x:x+1,y:y},
                {x:x+1-(8), y:y+1-16},
                {x:x+1-(8), y:y+2},
                false
            ),
            // DOWN
            new Doorway(
                {x:x,y:y+2},
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
                {x:x+1,y:y},
                {x:x+1-(8-3), y:y+1-7},
                {x:x+1-(8-3), y:y+2},
                false,
                {x: 7, y: 7},
                {x: 16, y: 16}
            ),
            // DOWN
            new Doorway(
                {x:x,y:y+2},
                {x:x+1,y:y+2},
                {x:x+1-(8-3), y:y+2},
                {x:x+1-(8-3), y:y+1-7},
                true,
                {x: 16, y: 16},
                {x: 7, y: 7}
            )
        ];
    });

    // DULL BLUE: Cave entry
    GB.LevelLoader.registerItem(0x3C4b6E, function(x, y, cxn) {
        return [
            // LEFT
            new Doorway(
                {x:x,y:y},
                {x:x,y:y+1},
                {x:x+1-16, y:y+1-(8+3)},
                {x:x+2, y:y+1-(8)},
                false,
                {x:16, y:16},
                {x:16, y:16},
                {x:x+2, y:y-21},
                {x:x+16, y:y-7}
            ),
            // RIGHT
            new Doorway(
                {x:x+2,y:y},
                {x:x+2,y:y+1},
                {x:x+2, y:y+1-(8)},
                {x:x+1-16, y:y+1-(8+3)},
                true
            )
        ];
    });

    // DULL BLUE II: Cave exit
    GB.LevelLoader.registerItem(0x2D3183, function(x, y, cxn) {
        return [
            // LEFT
            new Doorway(
                {x:x,y:y},
                {x:x,y:y+1},
                {x:x+1-16, y:y+1-(8+3)},
                {x:x+2, y:y+1-(8)},
                false
            ),
            // RIGHT
            new Doorway(
                {x:x+2,y:y},
                {x:x+2,y:y+1},
                {x:x+2, y:y+1-(8)},
                {x:x+1-16, y:y+1-(8)},
                true,
                {x:16, y:16},
                {x:16, y:16},
                {x:x-29, y:y-7},
                {x:x-15, y:y+7}
            )
        ];
    });

    // BLUE: Regular horizontal doorway
    GB.LevelLoader.registerItem(0x0000FF, function(x, y, cxn) {
        return [
            // LEFT
            new Doorway(
                {x:x,y:y},
                {x:x,y:y+1},
                {x:x+1-16, y:y+1-(8)},
                {x:x+2, y:y+1-(8)},
                false
            ),
            // RIGHT
            new Doorway(
                {x:x+2,y:y},
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
                {x:x,y:y+1},
                {x:x+1-16, y:y+1-(8+3)},
                {x:x+2, y:y+1-(2)},
                false,
                {x: 16, y: 16},
                {x:7, y:7}
            ),
            // RIGHT
            new Doorway(
                {x:x+2,y:y},
                {x:x+2,y:y+1},
                {x:x+2, y:y+1-(2)},
                {x:x+1-16, y:y+1-(8+3)},
                true,
                {x:7, y:7},
                {x: 16, y: 16}
            )
        ];
    });

    // CORNFLOWER: Teleporting horizontal doorway (going right)
    GB.LevelLoader.registerItem(0x698FAB, function(x, y, cxn) {
        return [
            // LEFT
            new TeleDoorway(
                {x:x,y:y},
                {x:x,y:y+1},
                {x:x-16, y:y+1-(8)},
                cxn
            ),
        ];
    });

    // CORNFLOWER II: Teleporting horizontal doorway (going left)
    GB.LevelLoader.registerItem(0x6499C1, function(x, y, cxn) {
        return [
            // LEFT
            new TeleDoorway(
                {x:x,y:y},
                {x:x,y:y+1},
                {x:x+1, y:y+1-(8)},
                cxn
            ),
        ];
    });

    // BLUE GLOAM: Intro room secret teleporting (horizontal) doorway
    GB.LevelLoader.registerItem(0x122F45, function(x, y, cxn) {
        return [
            // LEFT
            new TeleDoorway(
                {x:x,y:y},
                {x:x,y:y+1},
                {x:x-16, y:y-4},
                cxn,
                {x:16, y:16}
            ),
        ];
    });

    // BLUE TWILIGHT: Ending pathway left-hand teleporting doorway
    GB.LevelLoader.registerItem(0x063253, function(x, y, cxn) {
        return [
            // LEFT
            new TeleDoorway(
                {x:x,y:y},
                {x:x,y:y+1},
                {x:x+1, y:y-3},
                cxn,
                {x:7, y:7}
            ),
        ];
    });

    // RED-GRAY: Teleporting vertical doorway (going up)
    GB.LevelLoader.registerItem(0xAD7C8B, function(x, y, cxn) {
        return [
            // LEFT
            new TeleDoorway(
                {x:x,y:y},
                {x:x+1,y:y},
                {x:x+1-(8), y:y+1},
                cxn
            ),
        ];
    });

    // RED-GRAY II: Teleporting vertical doorway (going down)
    GB.LevelLoader.registerItem(0xC26F88, function(x, y, cxn) {
        return [
            // LEFT
            new TeleDoorway(
                {x:x,y:y},
                {x:x+1,y:y},
                {x:x+1-(8), y:y-16},
                cxn
            ),
        ];
    });

    // BUBBLEGUM: Teleporting vertical doorway (going up)
    GB.LevelLoader.registerItem(0xFFAFC7, function(x, y, cxn) {
        return [
            // LEFT
            new TeleDoorway(
                {x:x,y:y},
                {x:x+1,y:y},
                {x:x+1-(8), y:y+1},
                cxn,
                {x:16, y:16},
                {x:18,y:7},
                {x:32,y:21}
            ),
        ];
    });

    // MUSTARD: Checkpoint (sets respawn point in case of death)
    GB.LevelLoader.registerItem(0xDBBD5E, function(x, y) {
        return [new Checkpoint(x, y)];
    });

    // MAGENTA: Death zone (kills the player when they step into it)
    GB.LevelLoader.registerItem(0xFF00FF, function(x, y) {
        return [new DeathZone({x:x,y:y}, {x:x,y:y})];
    });

    // MAGENTA-ISH: Easter egg zone (for the final secret)
    GB.LevelLoader.registerItem(0xF200F3, function(x, y) {
        return [new EasterEggFind({x:x,y:y}, {x:x+1,y:y})];
    });

    // GREEN: Button
    GB.LevelLoader.registerItem(0x00FF00, function(x, y, cxn, add) {
        return [new Button(x, y, cxn, false, false, add === 0x000000? PS.COLOR_RED : add)];
    });

    // DARK GREEN: Invisible button
    GB.LevelLoader.registerItem(0x007400, function(x, y, cxn) {
        const button = new Button(x, y, cxn, true, false, 0x000000, "fx_beep", 0.5);
        new Invisibility(button);
        new NameChange(button, "Well-Hidden Button");
        return [button];
    });

    // GREENISH: Tri button
    GB.LevelLoader.registerItem(0x00F900, function(x, y, cxn, add) {
        return [new Button(x, y, cxn, false, true, add === 0x000000? PS.COLOR_RED : add)];
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

    // BRILLIANT ORANGE: Forest burn zone. Irreparably destroys the Weald when tread upon.
    GB.LevelLoader.registerItem(0xFF6E00, function(x, y) {
        return [new WoodsKerosene({x:x, y:y}, {x:x, y:y+1})];
    });

    // VERDANT: Ordinary shrub label.
    GB.LevelLoader.registerItem(0x00AA37, function(x, y) {
        return [new Label(x, y, "Ordinary Shrub")];
    });

    // EMERALD: Non-ordinary shrub label.
    GB.LevelLoader.registerItem(0x007C4A, function(x, y) {
        return [new Label(x, y, "Ordinary Shrub...?")];
    });

    // BLUISH: The most dapper shrub.
    GB.LevelLoader.registerItem(0x017C98, function(x, y) {
        return [new Label(x, y, "Mr. Shrub")];
    });

    // PURPLISH: The absolute fanciest shrub.
    GB.LevelLoader.registerItem(0x780198, function(x, y) {
        return [new Label(x, y, "Mrs. Shrub")];
    });

    // WARM YELLOW: The ambience of a tent.
    GB.LevelLoader.registerItem(0xF4C800, function(x, y) {
        return [new Label(x, y, "How cozy. And there's a note: \"WSNE\"...")];
    });

    // CRIMSON: A fire hazard.
    GB.LevelLoader.registerItem(0xFF1D23, function(x, y) {
        return [new Label(x, y, "Unattended Campfire", true)];
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

    // MAUVE: Lock, with no radius, CONNECTION as color and ADDITIONAL as border. Sends a signal on unlock
    GB.LevelLoader.registerItem(0x522542, function(x, y, cxn, add) {
        const lb = new LockBlock(x, y, cxn, add, 0, true);
        lb.setLabel("Inconspicuous Locked Block");
        return [lb];
    });

    // CLAY: Character C
    GB.LevelLoader.registerItem(0xC12500, function(x, y, cxn, add) {
        return [
            new Fragment(x, y, add, {top:10, left:32, right:0, bottom:0}),
            new Fragment(x+1, y, add, {top:10, left:0, right:0, bottom:0}),
            new Fragment(x, y+1, add, {top:0, left:32, right:0, bottom:10}),
            new Fragment(x+1, y+1, add, {top:0, left:0, right:0, bottom:10})
        ];
    });

    // CLAY: Character R
    GB.LevelLoader.registerItem(0xC12501, function(x, y, cxn, add) {
        return [
            new Fragment(x, y, add, {top:10, left:32, right:0, bottom:10}),
            new Fragment(x+1, y, add, {top:10, left:0, right:32, bottom:10}),
            new Fragment(x, y+1, add, {top:0, left:32, right:0, bottom:0}),
            new Fragment(x+1, y+1, add, {top:0, left:8, right:8, bottom:0}, true)
        ];
    });

    // CLAY: Character E
    GB.LevelLoader.registerItem(0xC12502, function(x, y, cxn, add) {
        return [
            new Fragment(x, y, add, {top:10, left:32, right:0, bottom:5}),
            new Fragment(x+1, y, add, {top:10, left:0, right:0, bottom:5}),
            new Fragment(x, y+1, add, {top:5, left:32, right:0, bottom:10}),
            new Fragment(x+1, y+1, add, {top:5, left:0, right:0, bottom:10})
        ];
    });

    // CLAY: Character A
    GB.LevelLoader.registerItem(0xC12503, function(x, y, cxn, add) {
        return [
            new Fragment(x, y, add, {top:10, left:32, right:0, bottom:5}),
            new Fragment(x+1, y, add, {top:10, left:0, right:32, bottom:5}),
            new Fragment(x, y+1, add, {top:5, left:32, right:0, bottom:0}),
            new Fragment(x+1, y+1, add, {top:5, left:0, right:32, bottom:0})
        ];
    });

    // CLAY: Character T
    GB.LevelLoader.registerItem(0xC12504, function(x, y, cxn, add) {
        return [
            new Fragment(x, y, add, {top:10, left:0, right:8, bottom:0}),
            new Fragment(x+1, y, add, {top:10, left:8, right:0, bottom:0}),
            new Fragment(x, y+1, add, {top:0, left:0, right:8, bottom:0}),
            new Fragment(x+1, y+1, add, {top:0, left:8, right:0, bottom:0})
        ];
    });

    // CLAY: Character D
    GB.LevelLoader.registerItem(0xC12505, function(x, y, cxn, add) {
        return [
            new Fragment(x, y, add, {top:0, left:0, right:0, bottom:5}),
            new Fragment(x+1, y, add, {top:0, left:0, right:32, bottom:5}),
            new Fragment(x, y+1, add, {top:5, left:32, right:0, bottom:10}),
            new Fragment(x+1, y+1, add, {top:5, left:0, right:32, bottom:10})
        ];
    });

    // CLAY: Character B
    GB.LevelLoader.registerItem(0xC12506, function(x, y, cxn, add) {
        return [
            new Fragment(x, y, add, {top:10, left:32, right:4, bottom:5}),
            new Fragment(x+1, y, add, {top:0, left:12, right:0, bottom:5}),
            new Fragment(x, y+1, add, {top:5, left:32, right:0, bottom:10}),
            new Fragment(x+1, y+1, add, {top:5, left:0, right:32, bottom:10})
        ];
    });

    // CLAY: Character Y
    GB.LevelLoader.registerItem(0xC12507, function(x, y, cxn, add) {
        return [
            new Fragment(x, y, add, {top:0, left:32, right:0, bottom:5}),
            new Fragment(x+1, y, add, {top:0, left:0, right:32, bottom:5}),
            new Fragment(x, y+1, add, {top:5, left:0, right:0, bottom:10}),
            new Fragment(x+1, y+1, add, {top:5, left:0, right:32, bottom:10})
        ];
    });

    // CLAY: Character O
    GB.LevelLoader.registerItem(0xC12508, function(x, y, cxn, add) {
        return [
            new Fragment(x, y, add, {top:10, left:32, right:0, bottom:0}),
            new Fragment(x+1, y, add, {top:10, left:0, right:32, bottom:0}),
            new Fragment(x, y+1, add, {top:0, left:32, right:0, bottom:10}),
            new Fragment(x+1, y+1, add, {top:0, left:0, right:32, bottom:10})
        ];
    });

    // CLAY: Character W
    GB.LevelLoader.registerItem(0xC12509, function(x, y, cxn, add) {
        return [
            new Fragment(x, y, add, {top:0, left:32, right:8, bottom:0}),
            new Fragment(x+1, y, add, {top:0, left:8, right:32, bottom:0}),
            new Fragment(x, y+1, add, {top:0, left:32, right:8, bottom:10}),
            new Fragment(x+1, y+1, add, {top:0, left:8, right:32, bottom:10})
        ];
    });

    // CLAY: Character L
    GB.LevelLoader.registerItem(0xC1250A, function(x, y, cxn, add) {
        return [
            new Fragment(x, y, add, {top:0, left:32, right:0, bottom:0}),
            new Fragment(x, y+1, add, {top:0, left:32, right:0, bottom:10}),
            new Fragment(x+1, y+1, add, {top:0, left:0, right:0, bottom:10})
        ];
    });

    // CLAY: Character :)
    GB.LevelLoader.registerItem(0xC1250B, function(x, y, cxn, add) {
        return [
            new Fragment(x, y, add, 0, true, 50),
            new Fragment(x+1, y, add, {top:10, left:0, right:32, bottom:0}),
            new Fragment(x, y+1, add, 0, true, 50),
            new Fragment(x+1, y+1, add, {top:0, left:0, right:32, bottom:10})
        ];
    });

    // CLAY: Character .
    GB.LevelLoader.registerItem(0xC1250C, function(x, y, cxn, add) {
        return [
            new Fragment(x, y, add, 0, true, 50)
        ];
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