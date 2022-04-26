class VictoryZone extends GB.AuraObject {

    static #won = false;

    constructor(start, end) {
        const playSound = function(thing) {
            if(thing.getType() === "hero" && !VictoryZone.#won) {
                VictoryZone.#won = true;
                PS.audioPlay("fx_tada", {volume: 0.2});

                Player.setTimerActive(false);
            }
        };


        super("victory_zone", start, end, playSound);
    }

}