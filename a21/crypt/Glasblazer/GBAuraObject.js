GB.Loader.addLoad(
    function(){


        class GBAuraObject extends GB.Object {
            #start_point;
            #end_point;

            #aura_object;

            constructor(type, start, end, thingToDoOnEnter, thingToDoOnLeave) {
                super(type);
                this.#start_point = start;
                this.#end_point = end;

                this.#aura_object = {in: thingToDoOnEnter, out: thingToDoOnLeave};

                for(let x = start.x; x <= end.x; x++) {
                    for(let y = start.y; y <= end.y; y++) {
                        GB.World.addAura(x, y, this.#aura_object);
                    }
                }
            }



            populate(pos) {

            }

            dePopulate(pos) {

            }

            beforeWeGo() {
                for(let x = this.#start_point.x; x <= this.#end_point.x; x++) {
                    for(let y = this.#start_point.y; x <= this.#end_point.y; x++) {
                        GB.World.clearAura(x, y, this.#aura_object);
                    }
                }
            }

            static #initialized = false;
            static awaken() {
                if (!this.#initialized) {
                    GB.AuraObject = GBAuraObject;
                }
            }
        }


        GBAuraObject.awaken();
    }
);