GB.Loader.addLoad(
    function(){


        class GBWorld {
            static #master_id = 2;
            static #master_through_id = -2;

            #map_colors = [];
            #map_collision = [];
            #aura_functions = {};

            #world_objects = [];
            #interests = [];
            #bounds = {x: 1, y: 1};

            #queued_for_deletion = [];

            #event_categories = {};


            hello(thing, use_pass_id = false) {
                this.#world_objects.push(thing);
                this.#interests.push([]);

                if(use_pass_id) {
                    thing.setID(GBWorld.#master_through_id--);
                } else {
                    thing.setID(GBWorld.#master_id++);
                }
            }

            goodbye(thing) {
                const ind = this.#world_objects.indexOf(thing);

                thing.clearConduit();

                this.#removeInterests(ind);
                this.#world_objects.splice(ind, 1);

                this.#interests.splice(ind, 1);
            }

            drawBackground() {
                for(let y = 0; y < GB.View.getHeight(); y++) {
                    for(let x = 0; x < GB.View.getWidth(); x++) {
                        const bg_pos = GB.Utility.viewToWorld({x: x, y: y});
                        PS.bgAlpha(x, y, PS.ALPHA_OPAQUE);
                        if(this.inBounds(bg_pos)) {
                            PS.bgColor(x, y, this.#map_colors[bg_pos.y][bg_pos.x]);
                        }
                        else {
                            PS.bgColor(x, y, GB.View.getBg());
                        }
                    }
                }

                PS.alpha(PS.ALL, PS.ALL, PS.COLOR_WHITE);
                PS.alpha(PS.ALL, PS.ALL, PS.ALPHA_TRANSPARENT);
            }

            markForDelete(thing) {
                if(!this.#queued_for_deletion.includes(thing)) {
                    this.#queued_for_deletion.push(thing);
                }

                // Genuine apologies to Professor Claypool for underestimating this function.
                // Not using it *breaks everything* and I learned that the hard way.

            }

            throwAwayQueuedThings() {
                for(let thing of this.#queued_for_deletion) {
                    if(thing !== null) {
                        thing.deleteObject();
                    }
                }

                this.#queued_for_deletion = [];
            }

            populateAll() {
                this.drawBackground();

                for(let thing of this.#world_objects) {
                    if(thing !== null) {
                        thing.drawToView();
                    }
                }
            }

            dePopulateAll() {
                for(let thing of this.#world_objects) {
                    if(thing !== null) {
                        thing.removeFromView();
                    }
                }
            }

            registerInterest(thing, event) {
                const event_type = event.evType();
                if (!this.#event_categories[event_type]) {
                    this.#event_categories[event_type] = [thing];
                    this.#appendInterest(thing, event_type);
                } else if (!this.#event_categories[event_type].includes(thing)) {
                    this.#event_categories[event_type].push(thing);
                    this.#appendInterest(thing, event_type);
                }
            }

            #appendInterest(thing, event_type) {
                let index;

                if (this.#world_objects[this.#world_objects.length - 1] === thing) {
                    index = this.#world_objects.length - 1;
                } else {
                    index = this.#world_objects.indexOf(thing);
                }

                this.#interests[index].push(event_type);
            }

            #removeInterests(index) {
                if(this.#interests[index]) {
                    for (let interest of this.#interests[index]) {
                        if (interest !== null) {
                            const sub_ind = this.#event_categories[interest].indexOf(this.#world_objects[index]);
                            this.#event_categories[interest].splice(sub_ind, 1);
                        }
                    }
                }
            }

            addAura(x, y, func) {
                if(!this.#aura_functions[[x, y]]) {
                    this.#aura_functions[[x, y]] = [func];
                }
                else {
                    this.#aura_functions[[x, y]].push(func);
                }
            }

            aurasAt(x, y) {
                return this.#aura_functions[[x, y]];
            }

            clearAura(x, y, func) {
                const ind = this.#aura_functions[[x, y]].indexOf(func);
                this.#aura_functions.splice(ind, 1);

                if(this.#aura_functions[[x, y]] === []) {
                    delete this.#aura_functions[[x, y]];
                }
            }

            sendEvent(event) {
                let interested = this.#event_categories[event.getType()];

                if (interested) {
                    for (let thing of interested) {
                        if (thing != null) {
                            thing.doEvent(event);
                        }
                    }
                }
            }

            setBounds(x_dim, y_dim) {
                this.#bounds = {x: x_dim, y: y_dim};

                this.#map_colors = [];
                this.#map_collision = [];
                for(let i_y = 0; i_y < y_dim; i_y++) {
                    this.#map_colors.push([]);
                    this.#map_collision.push([]);
                    for(let i_x = 0; i_x < x_dim; i_x++) {
                        this.#map_colors[i_y].push(PS.COLOR_WHITE);
                        this.#map_collision[i_y].push(false);
                    }
                }
            }

            getBoundsX() {
                return this.#bounds.x;
            }

            getBoundsY() {
                return this.#bounds.y;
            }

            inBounds(pos) {
                let x, y;
                if(Array.isArray(pos)) {
                    x = pos[0];
                    y = pos[1];
                }
                else {
                    x = pos.x;
                    y = pos.y;
                }

                return x >= 0 && y >= 0 && x < this.getBoundsX() && y < this.getBoundsY();
            }

            inBoundsX(x_p) {
                return x_p >= 0 && x_p < this.getBoundsX();
            }

            inBoundsY(y_p) {
                return y_p >= 0 && y_p < this.getBoundsX();
            }

            collision(x, y) {
                const to_vw = GB.Utility.worldToView({x: x, y: y});
                const x_bd = to_vw.x;
                const y_bd = to_vw.y;
                return !this.inBounds({x: x, y: y}) || this.#map_collision[y][x] || (GB.View.inView({x: x_bd, y: y_bd}) && PS.data(x_bd, y_bd) > 0);
            }

            setCollisionArray(coll) {
                this.#map_collision = coll;
            }

            setCollisionSquare(x, y, is_coll) {
                this.#map_collision[y][x] = is_coll;
            }

            setBackgroundArray(bg) {
                this.#map_colors = bg;
            }

            getBackgroundColorAt(x, y) {
                PS.debug(this.#map_colors[y][x].toString(16));
                return this.#map_colors[y][x];
            }

            objectFromID(id) {
                for(let thing of this.#world_objects) {
                    if(thing !== null && thing.getID() === id) {
                        return thing;
                    }
                }

                return null;
            }


            // A variation on the singleton pattern
            constructor() {
                if(GBWorld.#initialized) {
                    throw "Attempt to re-initialize " + this.constructor.name;
                }
            }

            static #initialized = false;
            static awaken() {
                if (!this.#initialized) {
                    GB.World = new GBWorld();
                    this.#initialized = true;
                }
            }
        }



        GBWorld.awaken();
    }
);