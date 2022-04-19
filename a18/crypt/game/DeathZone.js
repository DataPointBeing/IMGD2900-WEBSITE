class DeathZone extends GB.AuraObject {

    constructor(start, end) {
        const deathTime = function(thing) {
            if(thing.getType() === "hero") {
                thing.setPosition(GB.Utility.viewToWorld({x: GB.View.getWidth()/2, y: GB.View.getHeight()/2}));
                PS.audioPlay("fx_hoot", {volume: 0.2});
            }
        };


        super("deathzone", start, end, deathTime);
    }

}