GB.Loader.addLoad(
    function(){


        class GBInputEvent extends GB.Event {
            static evType() {
                return "gb_input";
            }

            #input;
            #down;

            constructor(input, down) {
                super(GBInputEvent.evType());
                this.#input = input;
                this.#down = down;
            }

            getInput() {
                return this.#input;
            }

            getIsDown() {
                return this.#down;
            }


            static #initialized = false;
            static awaken() {
                if (!this.#initialized) {
                    GB.InputEvent = GBInputEvent;
                }
            }
        }


        GBInputEvent.awaken();
    }
);