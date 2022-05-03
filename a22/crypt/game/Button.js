class Button extends Interactable {
    #frequency;
    #color;

    #sound;
    #volume;

    #one_press
    #interacted

    #is_tri;

    constructor(x, y, cnx, one_press = false, tri = false, color = PS.COLOR_RED, sound = "fx_blip", sound_vol = 0.2) {
        super("button", "Button");
        super.setPosition({x:x,y:y});
        this.#frequency = cnx;
        this.#color = color;

        this.#sound = sound;
        this.#volume = sound_vol;
        this.#is_tri = tri;

        this.#one_press = one_press;
        this.#interacted = false;
    }

    populate(pos) {
        PS.border(pos.x, pos.y, 10);
        PS.borderColor(pos.x, pos.y, 0x636363);
        PS.alpha(pos.x, pos.y, PS.ALPHA_OPAQUE);
        PS.borderAlpha(pos.x, pos.y, PS.ALPHA_OPAQUE);
        PS.color(pos.x, pos.y, this.#color);
        super.populate(pos);
    }

    dePopulate(pos) {
        PS.border(pos.x, pos.y, 0);
        PS.borderColor(pos.x, pos.y, PS.COLOR_WHITE);
        PS.alpha(pos.x, pos.y, PS.ALPHA_TRANSPARENT);
        PS.borderAlpha(pos.x, pos.y, PS.ALPHA_TRANSPARENT);
        PS.color(pos.x, pos.y, PS.COLOR_WHITE);
        super.dePopulate(pos);
    }

    handleInteract() {
        if(!(this.#one_press && this.#interacted)) {
            PS.audioPlay(this.#sound, {volume: this.#volume});
            GB.World.sendEvent(new SignalEvent(this.#frequency, this.#is_tri));
            this.alertConduit();
            this.#interacted = true;
        }
    }

    getFrequency() {
        return this.#frequency;
    }
}