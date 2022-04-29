class DeathZone extends GB.AuraObject {

    constructor(start, end) {
        const deathTime = function(thing) {
            if(thing.getType() === "hero") {
                thing.kill();
            }
        };


        super("deathzone", start, end, deathTime);
    }

}