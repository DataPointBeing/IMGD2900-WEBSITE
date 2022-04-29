class Key extends Interactable {

    #frequency;

    #color;
    #radius;

    constructor(x, y, freq, color = 0x636363, radius = 10) {
        super("key");
        this.setPosition({x:x, y:y});

        this.#color = color;
        this.#radius = radius;

        this.#frequency = freq;
    }

    populate(pos) {
        PS.color(pos.x, pos.y, this.#frequency);
        PS.alpha(pos.x, pos.y, PS.ALPHA_OPAQUE);
        PS.scale(pos.x, pos.y, 60);
        PS.borderAlpha(pos.x, pos.y, PS.ALPHA_OPAQUE);
        PS.radius(pos.x, pos.y, this.#radius);
        PS.data(pos.x, pos.y, 1);
        super.populate(pos);
    }

    dePopulate(pos) {
        PS.color(pos.x, pos.y, PS.COLOR_WHITE);
        PS.alpha(pos.x, pos.y, PS.ALPHA_TRANSPARENT);
        PS.scale(pos.x, pos.y, 100);
        PS.borderAlpha(pos.x, pos.y, PS.ALPHA_TRANSPARENT);
        PS.radius(pos.x, pos.y, 0);
        PS.data(pos.x, pos.y, null);
        super.dePopulate(pos);
    }

    getFrequency() {
        return this.#frequency;
    }

    handleInteract() {
        if(Player.getKey() === null) {
            Player.setKey(this.#frequency);

            GB.World.markForDelete(this);
            PS.audioPlay("fx_coin3", {volume: 0.1});
        }
        else {
            PS.audioPlay("fx_hoot", {volume: 0.2});
        }
    }
}