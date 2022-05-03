class WoodsKerosene extends GB.AuraObject {

    static #woods_are_on_fire;

    constructor(start, end) {
        const burnThem = function(thing) {
            if(thing.getType() === "hero" && !WoodsKerosene.#woods_are_on_fire) {
                WoodsKerosene.#woods_are_on_fire = true;
                PS.audioPlay("fx_swoosh", {volume: 0.5});
                new Label(1, 42, "...Did you cause this forest fire?", true, 0xc75723).refresh();
                new Label(1, 43, "The adjacent room is on fire.", true, 0xce9a21).refresh();
                new Label(18, 59, "Don't go in there! The woods are ablaze!", true, 0xc75723).refresh();
                new Label(18, 60, "Only you can prevent forest fires.", true, 0xce9a21).refresh();
                // set them on fire. (1, 42) (1, 43) (18, 59) (18, 60)
            }
        };


        super("woods_burner", start, end, burnThem);
        WoodsKerosene.#woods_are_on_fire = false;
    }

}