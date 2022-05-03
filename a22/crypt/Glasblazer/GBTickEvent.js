GB.Loader.addLoad(
    function(){


        class GBTickEvent extends GB.Event {
            static evType() {
                return "gb_tick";
            }

            #ticks_elapsed;

            constructor(elapsed) {
                super(GBTickEvent.evType());
                this.#ticks_elapsed = elapsed;
            }

            getTicks() {
                return this.#ticks_elapsed;
            }


            static #initialized = false;
            static awaken() {
                if (!this.#initialized) {
                    GB.TickEvent = GBTickEvent;
                }
            }
        }


        GBTickEvent.awaken();
    }
);