GB.Loader.addLoad(
    function(){


        class GBView {
            #view_position = {x: 0, y: 0};
            #default_bg = PS.COLOR_BLACK;

            setViewGrid(x_dim, y_dim, bg) {
                PS.gridSize(x_dim, y_dim);
                if(bg !== 'undefined') {
                    this.setBg(bg);
                }
                else {
                    this.setBg(this.#default_bg);
                }

                PS.border(PS.ALL, PS.ALL, 0);
                PS.alpha(PS.ALL, PS.ALL, PS.ALPHA_TRANSPARENT);

                GB.World.populateAll();

                PS.gridColor(PS.COLOR_BLACK);
                PS.statusColor(PS.COLOR_WHITE);
            }

            setPosition(new_pos) {
                let new_pos_conv;
                if(Array.isArray(new_pos)){
                    new_pos_conv = {x: new_pos[0], y: new_pos[1]};
                }
                else {
                    new_pos_conv = new_pos;
                }

                if(!GB.Utility.positionsEqual(new_pos_conv, this.#view_position)) {
                    this.#doMove(new_pos_conv);
                }
            }

            #doMove(new_pos) {
                GB.World.dePopulateAll();
                this.#view_position = new_pos;
                GB.World.populateAll();
            }

            getPosition() {
                return this.#view_position;
            }

            getPositionX() {
                return this.#view_position.x;
            }

            getPositionY() {
                return this.#view_position.y;
            }

            getWidth() {
                return PS.gridSize().width;
            }

            getHeight() {
                return PS.gridSize().height;
            }

            worldInView(pos) {
                return this.inView(GB.Utility.worldToView(pos));
            }

            inView(pos) {
                let x, y;
                if(Array.isArray(pos)) {
                    x = pos[0];
                    y = pos[1];
                }
                else {
                    x = pos.x;
                    y = pos.y;
                }

                return x >= 0 && y >= 0 && x < this.getWidth() && y < this.getHeight();
            }

            getBg() {
                return this.#default_bg;
            }

            setBg(bg) {
                PS.bgAlpha(PS.ALL, PS.ALL, PS.ALPHA_OPAQUE);
                PS.bgColor(PS.ALL, PS.ALL, bg);
                this.#default_bg = bg;
            }

            removeBg() {
                PS.bgAlpha(PS.ALL, PS.ALL, PS.ALPHA_TRANSPARENT);
            }


            // A variation on the singleton pattern
            constructor() {
                if(GBView.#initialized) {
                    throw "Attempt to re-initialize " + this.constructor.name;
                }
            }

            static #initialized = false;
            static awaken() {
                if (!this.#initialized) {
                    GB.View = new GBView();
                    this.#initialized = true;
                }
            }
        }



        GBView.awaken();
    }
);