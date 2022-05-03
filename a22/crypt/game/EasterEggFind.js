class EasterEggFind extends GB.AuraObject {

    constructor(start, end) {
        let did_it = false;

        const egg = function(thing) {
            if(thing.getType() === "hero" && !did_it) {
                Player.causeToBeEgged();
                did_it = true;
            }
        };


        super("egg_zone", start, end, egg);
    }

}