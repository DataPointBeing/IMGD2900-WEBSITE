GB.Loader.addLoad(
    function(){


        class GBUtility {

            static worldToView(pos) {
                let x, y;
                if(Array.isArray(pos)) {
                    x = pos[0];
                    y = pos[1];
                }
                else {
                    x = pos.x;
                    y = pos.y;
                }

                return {x: x - GB.View.getPositionX(), y: y - GB.View.getPositionY()};
            }

            static viewToWorld(pos) {
                let x, y;
                if(Array.isArray(pos)) {
                    x = pos[0];
                    y = pos[1];
                }
                else {
                    x = pos.x;
                    y = pos.y;
                }

                return {x: x + GB.View.getPositionX(), y: y + GB.View.getPositionY()};
            }

            static positionsEqual(pos1, pos2) {
                return pos1.x === pos2.x && pos1.y === pos2.y;
            }

            // Static-ish class
            constructor() {
                throw "Attempt to instantiate " + this.constructor.name;
            }

            static #initialized = false;
            static awaken() {
                if (!this.#initialized) {
                    GB.Utility = GBUtility;
                    this.#initialized = true;
                }
            }
        }



        GBUtility.awaken();
    }
);