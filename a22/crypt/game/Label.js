class Label extends GB.Object {

    #text;
    #color;

    constructor(x, y, text, solid = false, color = null) {
        super("world_label", !solid);
        this.setPosition({x:x, y:y});

        this.#text = text;
        this.#color = color;

        GB.World.registerInterest(this, LookEvent);
    }

    doEvent(event) {
        switch(event.getType()) {
            case LookEvent.evType():
                Player.setLookingAt(this.#text);
                break;
        }
    }

    populate(pos) {
        PS.data(pos.x, pos.y, super.getID());

        if(this.#color !== null) {
            PS.color(pos.x, pos.y, this.#color);
            PS.alpha(pos.x, pos.y, PS.ALPHA_OPAQUE);
        }
    }

    dePopulate(pos) {
        PS.data(pos.x, pos.y, null);
        PS.alpha(pos.x, pos.y, PS.ALPHA_TRANSPARENT);
    }

    getText() {
        return this.#text;
    }
}