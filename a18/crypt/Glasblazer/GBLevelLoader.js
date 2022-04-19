GB.Loader.addLoad(
    function(){


        class GBLevelLoader {

            static level_path = "levels/";

            static #backgrounds = {};
            static #collisions = {};
            static #connections = {};

            static done_loading = 0;
            static needed = 0;

            static nextOrderOfBusiness;

            static dunzo() {
                this.done_loading++;
                if (this.done_loading === this.needed) {
                    this.nextOrderOfBusiness();
                }
            }

            loadTheseLevels(levels, onComplete) {
                GBLevelLoader.nextOrderOfBusiness = onComplete;
                for(let lev of levels) {
                    if(lev !== null){
                        GBLevelLoader.needed += 3;
                        let bg = function(imageData){
                            GBLevelLoader.#backgrounds[lev] = imageData;
                            GBLevelLoader.dunzo();
                        }
                        let col = function(imageData){
                            GBLevelLoader.#collisions[lev] = imageData;
                            GBLevelLoader.dunzo();
                        }
                        let cnx = function(imageData){
                            GBLevelLoader.#connections[lev] = imageData;
                            GBLevelLoader.dunzo();
                        }

                        PS.imageLoad(GBLevelLoader.level_path + lev + ".gif", bg);
                        PS.imageLoad(GBLevelLoader.level_path + lev + "_OBJECTS.gif", col);
                        PS.imageLoad(GBLevelLoader.level_path + lev + "_CONNECTIONS.gif", cnx);
                    }
                }
            }

            makeItem(x, y, color, connection) {
                switch(color) {
                    case 0xFF0000:
                        new Doorway(
                            {x:x,y:y},
                            {x:x+1,y:y+1},
                            {x:x+1-(GB.View.getWidth()/2), y:y+1-GB.View.getHeight()},
                            {x:x+1-(GB.View.getWidth()/2), y:y+2}
                        );
                        new Doorway(
                            {x:x,y:y+1},
                            {x:x+1,y:y+2},
                            {x:x+1-(GB.View.getWidth()/2), y:y+2},
                            {x:x+1-(GB.View.getWidth()/2), y:y+1-GB.View.getHeight()}
                        );
                        break;
                    case 0x0000FF:
                        new Doorway(
                            {x:x,y:y},
                            {x:x+1,y:y+1},
                            {y:y+1-(GB.View.getHeight()/2), x:x+1-GB.View.getWidth()},
                            {y:y+1-(GB.View.getHeight()/2), x:x+2}
                        );
                        new Doorway(
                            {x:x+1,y:y},
                            {x:x+2,y:y+1},
                            {x:x+2, y:y+1-(GB.View.getHeight()/2)},
                            {x:x+1-GB.View.getWidth(), y:y+1-(GB.View.getHeight()/2)}
                        );
                        break;
                    case 0xFF00FF:
                        new DeathZone({x:x,y:y}, {x:x,y:y});
                        break;
                    case 0x00FF00:
                        new Button(x, y, connection);
                        break;
                    case 0x00FFFF:
                        new MobileWall(x, y, connection);
                        break;
                    case 0xFFAA00:
                        new VictoryZone({x:x, y:y}, {x:x+1, y:y});
                        break;
                }
            }

            buildLevel(level) {
                const coll = GBLevelLoader.#collisions[level];
                const bg = GBLevelLoader.#backgrounds[level];
                const cnx = GBLevelLoader.#connections[level];

                GB.World.setBounds(coll.width, coll.height);

                const coll_bools = [];
                const bg_colors = [];
                for(let i_y = 0; i_y < coll.height; i_y++) {
                    coll_bools.push([]);
                    bg_colors.push([]);
                    for(let i_x = 0; i_x < coll.width; i_x++) {
                        const k_x = (i_x +(i_y*coll.width)) * 4;

                        //PS.debug(bg.data[k_x] + ", " + bg.data[k_x+1] + ", " + bg.data[k_x+2] + "\n");
                        const bg_c = PS.makeRGB(bg.data[k_x], bg.data[k_x+1], bg.data[k_x+2]);
                        bg_colors[i_y].push(bg_c);

                        const b_c = PS.makeRGB(coll.data[k_x], coll.data[k_x+1], coll.data[k_x+2]);
                        const b_cnx = PS.makeRGB(cnx.data[k_x], cnx.data[k_x+1], cnx.data[k_x+2]);
                        coll_bools[i_y].push(b_c === 0xFFFFFF);
                        this.makeItem(i_x, i_y, b_c, b_cnx);
                    }
                }

                GB.World.setBackgroundArray(bg_colors);
                GB.World.setCollisionArray(coll_bools);

                let hero = new Player();
                hero.setPosition({x: 25, y: 59});

                GB.World.dePopulateAll();
                GB.World.populateAll();
            }


            // A variation on the singleton pattern
            constructor() {
                if(GBLevelLoader.#initialized) {
                    throw "Attempt to re-initialize " + this.constructor.name;
                }
            }

            static #initialized = false;
            static awaken() {
                if (!this.#initialized) {
                    GB.LevelLoader = new GBLevelLoader();
                    this.#initialized = true;
                }
            }

        }



        GBLevelLoader.awaken();
    }
);