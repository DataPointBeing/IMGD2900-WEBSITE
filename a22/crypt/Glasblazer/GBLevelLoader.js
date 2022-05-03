GB.Loader.addLoad(
    function(){


        class GBLevelLoader {

            static level_path = "levels/";

            static #backgrounds = {};
            static #collisions = {};
            static #connections = {};
            static #additional = {};

            static #conduits = {};
            static #conduit_connections = {};

            static done_loading = 0;
            static needed = 0;

            static item_types = {};
            static conduit_types = {};

            static nextOrderOfBusiness;

            static #dunzo() {
                this.done_loading++;
                if (this.done_loading === this.needed) {
                    this.nextOrderOfBusiness();
                }
            }

            loadTheseLevels(levels, onComplete) {
                GBLevelLoader.nextOrderOfBusiness = onComplete;
                for(let lev of levels) {
                    if(lev !== null){
                        GBLevelLoader.needed += 6;
                        let bg = function(imageData){
                            GBLevelLoader.#backgrounds[lev] = imageData;
                            GBLevelLoader.#dunzo();
                        }
                        let col = function(imageData){
                            GBLevelLoader.#collisions[lev] = imageData;
                            GBLevelLoader.#dunzo();
                        }
                        let cnx = function(imageData){
                            GBLevelLoader.#connections[lev] = imageData;
                            GBLevelLoader.#dunzo();
                        }
                        let add = function(imageData){
                            GBLevelLoader.#additional[lev] = imageData;
                            GBLevelLoader.#dunzo();
                        }
                        let cond = function(imageData){
                            GBLevelLoader.#conduits[lev] = imageData;
                            GBLevelLoader.#dunzo();
                        }
                        let cond_cnx = function(imageData){
                            GBLevelLoader.#conduit_connections[lev] = imageData;
                            GBLevelLoader.#dunzo();
                        }

                        PS.imageLoad(GBLevelLoader.level_path + lev + ".gif", bg);
                        PS.imageLoad(GBLevelLoader.level_path + lev + "_OBJECTS.gif", col);
                        PS.imageLoad(GBLevelLoader.level_path + lev + "_CONNECTIONS.gif", cnx);
                        PS.imageLoad(GBLevelLoader.level_path + lev + "_ADDITIONAL.gif", add);
                        PS.imageLoad(GBLevelLoader.level_path + lev + "_CONDUITS.gif", cond);
                        PS.imageLoad(GBLevelLoader.level_path + lev + "_CONDUITCONNECTIONS.gif", cond_cnx);
                    }
                }
            }

            registerItem(color, makerFn) {
                GBLevelLoader.item_types[color] = makerFn;
            }

            registerConduit(color, makerFn) {
                GBLevelLoader.conduit_types[color] = makerFn;
            }

            static #makeItem(x, y, color, connection, additional) {
                const item = GBLevelLoader.item_types[color];

                if(item) {
                    return item(x, y, connection, additional);
                }

                return [];
            }

            static #makeConduit(x, y, color, connection) {
                const cond = GBLevelLoader.conduit_types[color];

                if(cond) {
                    return cond(x, y, connection);
                }

                return null;
            }

            buildLevel(level) {
                const coll = GBLevelLoader.#collisions[level];
                const bg = GBLevelLoader.#backgrounds[level];
                const cnx = GBLevelLoader.#connections[level];
                const add = GBLevelLoader.#additional[level];
                const cond = GBLevelLoader.#conduits[level];
                const condcnx = GBLevelLoader.#conduit_connections[level];

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
                        const b_add = PS.makeRGB(add.data[k_x], add.data[k_x+1], add.data[k_x+2]);
                        coll_bools[i_y].push(b_c === 0xFFFFFF);

                        const b_cond = PS.makeRGB(cond.data[k_x], cond.data[k_x+1], cond.data[k_x+2]);
                        const b_condcnx = PS.makeRGB(condcnx.data[k_x], condcnx.data[k_x+1], condcnx.data[k_x+2]);

                        const things = GBLevelLoader.#makeItem(i_x, i_y, b_c, b_cnx, b_add);
                        const conduit = GBLevelLoader.#makeConduit(i_x, i_y, b_cond, b_condcnx);

                        if(conduit !== null) {
                            for (let thing of things) {
                                conduit.bind(thing);
                            }
                        }
                    }
                }

                GB.World.setBackgroundArray(bg_colors);
                GB.World.setCollisionArray(coll_bools);

                GB.View.setViewGrid(16, 16, PS.COLOR_BLACK);
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