class LockBlock extends Interactable {

    #frequency;

    #color;
    #radius;

    #do_signal;

    constructor(x, y, freq, color = 0x9b7b4f, radius = 10, signal = false) {
        super("locked_block", "Locked Block");
        this.setPosition({x:x, y:y});

        this.#color = color;
        this.#radius = radius;

        this.#frequency = freq;
        this.#do_signal = signal;
    }

    populate(pos) {
        PS.borderColor(pos.x, pos.y, this.#color);
        PS.color(pos.x, pos.y, this.#frequency);
        PS.alpha(pos.x, pos.y, PS.ALPHA_OPAQUE);
        PS.border(pos.x, pos.y, 6);
        PS.borderAlpha(pos.x, pos.y, PS.ALPHA_OPAQUE);
        PS.radius(pos.x, pos.y, this.#radius);
        PS.data(pos.x, pos.y, 1);
        super.populate(pos);
    }

    dePopulate(pos) {
        PS.borderColor(pos.x, pos.y, PS.COLOR_WHITE);
        PS.color(pos.x, pos.y, PS.COLOR_WHITE);
        PS.alpha(pos.x, pos.y, PS.ALPHA_TRANSPARENT);
        PS.border(pos.x, pos.y, 0);
        PS.borderAlpha(pos.x, pos.y, PS.ALPHA_TRANSPARENT);
        PS.radius(pos.x, pos.y, 0);
        PS.data(pos.x, pos.y, null);
        super.dePopulate(pos);
    }

    getFrequency() {
        return this.#frequency;
    }

    handleInteract() {
        if(Player.getKey() === this.#frequency) {
            Player.setKey(null);

            GB.World.markForDelete(this);
            PS.audioPlay("fx_shoot8", {volume: 0.1});

            if(this.#do_signal) {
                GB.World.sendEvent(new SignalEvent(this.#frequency));
            }
        }
        else {
            PS.audioPlay("fx_hoot", {volume: 0.2});
        }
    }
}