class MobileWall extends GB.Object {

    #frequency;

    constructor(x, y, freq) {
        super("slide_barrier");
        super.setPosition({x:x, y:y});

        this.#frequency = freq;

        GB.World.registerInterest(this, ButtonEvent);
    }

    doEvent(event) {
        switch(event.getType()) {
            case ButtonEvent.evType():
                if(event.getFrequency() === this.#frequency) {
                    super.deleteObject();
                    //PS.debug("OKAY! (I'm " + this.#frequency + "! That's " + event.getFrequency() + ".)\n")
                }
                else{
                    //PS.debug("not it. (I'm " + this.#frequency + "! That's " + event.getFrequency() + ".)\n")
                }
                break;
        }
    }

    populate(pos) {
        PS.color(pos.x, pos.y, 0x636363);
        PS.alpha(pos.x, pos.y, PS.ALPHA_OPAQUE);
        PS.radius(pos.x, pos.y, 10);
        PS.data(pos.x, pos.y, 1);
    }

    dePopulate(pos) {
        PS.color(pos.x, pos.y, PS.COLOR_WHITE);
        PS.alpha(pos.x, pos.y, PS.ALPHA_TRANSPARENT);
        PS.radius(pos.x, pos.y, 0);
        PS.data(pos.x, pos.y, null);
    }
}