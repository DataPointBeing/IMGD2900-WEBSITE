class Invisibility {
    #inner_thing;

    constructor(thing) {
        this.#inner_thing = thing;

        thing.addPopOverride(function(pos) {
            PS.alpha(pos.x, pos.y, PS.ALPHA_TRANSPARENT)
            PS.borderAlpha(pos.x, pos.y, PS.ALPHA_TRANSPARENT)
        });
    }
}