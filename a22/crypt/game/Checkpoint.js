class Checkpoint extends GB.AuraObject {

    constructor(x, y) {
        const enterThis = function(thing) {
            if(thing.getType() === "hero") {
                thing.getCheckpoint();
            }
        };
        const exitThis = function(thing) {

        };

        super("checkpoint", {x:x, y:y}, {x:x, y:y}, enterThis, exitThis);
    }

}