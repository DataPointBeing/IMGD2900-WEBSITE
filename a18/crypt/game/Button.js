class Button extends Interactable {
    #frequency;
    #interacted = false;

    constructor(x, y, cnx) {
        super("button");
        super.setPosition({x:x,y:y});
        this.#frequency = cnx;
        GB.World.registerInterest(this, InteractEvent);
    }

    populate(pos) {
        PS.border(pos.x, pos.y, 10);
        PS.borderColor(pos.x, pos.y, 0x555555);
        PS.alpha(pos.x, pos.y, PS.ALPHA_OPAQUE);
        PS.borderAlpha(pos.x, pos.y, PS.ALPHA_OPAQUE);
        PS.color(pos.x, pos.y, PS.COLOR_RED);
        super.populate(pos);
    }

    dePopulate(pos) {
        PS.border(pos.x, pos.y, 0);
        PS.borderColor(pos.x, pos.y, PS.COLOR_WHITE);
        PS.alpha(pos.x, pos.y, PS.ALPHA_TRANSPARENT)
        PS.borderAlpha(pos.x, pos.y, PS.ALPHA_TRANSPARENT)
        PS.color(pos.x, pos.y, PS.COLOR_WHITE);
        super.dePopulate(pos);
    }

    handleInteract() {
        if(!this.#interacted) {
            PS.audioPlay("fx_blip", {volume: 0.2});
            GB.World.sendEvent(new ButtonEvent(this.#frequency));
            this.#interacted = true;
        }
    }
}