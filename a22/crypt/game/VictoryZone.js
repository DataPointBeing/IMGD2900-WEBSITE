class VictoryZone extends GB.AuraObject {

    static #won = false;

    constructor(start, end) {
        const playSound = function(thing) {
            if(thing.getType() === "hero" && !VictoryZone.#won) {
                VictoryZone.#won = true;
                PS.audioPlay("fx_tada", {volume: 0.2});

                Player.setTimerActive(false);

                if(Player.finishTimeSeconds() <= 30) {
                    Player.setWinMessage("OUTSTANDING! Won a gold medal!");
                    Player.setKey(0xF99A1B);
                    GB.World.sendEvent(new SignalEvent(0xE88342));
                }
            }
        };


        super("victory_zone", start, end, playSound);
    }

}