class Fragment extends GB.Object {

    #border;

    #inverted;
    #color;
    #scale;

    constructor(x, y, color, border, inverted = false, scale = 100) {
        super("lettering");
        this.setPosition({x:x, y:y});

        this.#border = border;
        this.#color = color;
        this.#scale = scale;
        this.#inverted = inverted
    }

    populate(pos) {
        PS.minimum(pos.x, pos.y, 0);
        PS.borderColor(pos.x, pos.y, this.#inverted? 0x3e4e3f : this.#color);
        PS.color(pos.x, pos.y, this.#inverted? this.#color : 0x3e4e3f);
        PS.alpha(pos.x, pos.y, PS.ALPHA_OPAQUE);
        PS.scale(pos.x, pos.y, this.#scale);
        PS.borderAlpha(pos.x, pos.y, PS.ALPHA_OPAQUE);
        PS.border(pos.x, pos.y, this.#border);
        PS.data(pos.x, pos.y, 1);
    }

    dePopulate(pos) {
        PS.minimum(pos.x, pos.y, PS.DEFAULT);
        PS.color(pos.x, pos.y, PS.COLOR_WHITE);
        PS.borderColor(pos.x, pos.y, PS.COLOR_WHITE);
        PS.alpha(pos.x, pos.y, PS.ALPHA_TRANSPARENT);
        PS.scale(pos.x, pos.y, 100);
        PS.borderAlpha(pos.x, pos.y, PS.ALPHA_TRANSPARENT);
        PS.border(pos.x, pos.y, 0);
        PS.data(pos.x, pos.y, null);
    }
}