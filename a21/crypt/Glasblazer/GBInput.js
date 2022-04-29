GB.Loader.addLoad(
    function(){


        class GBInput {
            static UP = "up";
            static DOWN = "down";
            static LEFT = "left";
            static RIGHT = "right";
            static SPACE = "space";

            processInput(input, down) {
                switch(input) {
                    case PS.KEY_ARROW_UP:
                    case 0x77:
                        GB.World.sendEvent(new GB.InputEvent(GBInput.UP, down));
                        break;
                    case PS.KEY_ARROW_DOWN:
                    case 0x73:
                        GB.World.sendEvent(new GB.InputEvent(GBInput.DOWN, down));
                        break;
                    case PS.KEY_ARROW_LEFT:
                    case 0x61:
                        GB.World.sendEvent(new GB.InputEvent(GBInput.LEFT, down));
                        break;
                    case PS.KEY_ARROW_RIGHT:
                    case 0x64:
                        GB.World.sendEvent(new GB.InputEvent(GBInput.RIGHT, down));
                        break;
                    case PS.KEY_SPACE:
                        GB.World.sendEvent(new GB.InputEvent(GBInput.SPACE, down));
                        break;
                }
            }


            // A variation on the singleton pattern
            constructor() {
                if(GBInput.#initialized) {
                    throw "Attempt to re-initialize " + this.constructor.name;
                }
            }

            static #initialized = false;
            static awaken() {
                if (!this.#initialized) {
                    GB.Input = new GBInput();
                    GB.InputType = {
                        UP : GBInput.UP,
                        DOWN : GBInput.DOWN,
                        LEFT : GBInput.LEFT,
                        RIGHT : GBInput.RIGHT,
                        SPACE : GBInput.SPACE,
                    };
                    this.#initialized = true;
                }
            }
        }



        GBInput.awaken();
    }
);