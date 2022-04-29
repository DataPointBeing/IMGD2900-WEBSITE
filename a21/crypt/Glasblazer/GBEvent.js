GB.Loader.addLoad(
    function() {


        class GBEvent {
            #type;

            constructor(type) {
                if(!type){
                    throw "Event must have a type";
                }

                this.#type = type;
            }

            getType() {
                return this.#type;
            }

            static #initialized = false;
            static awaken() {
                if (!this.#initialized) {
                    GB.Event = GBEvent;
                }
            }
        }


        GBEvent.awaken();
    }
);