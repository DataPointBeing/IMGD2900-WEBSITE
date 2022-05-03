class AllActiveConduit extends GB.Conduit {

    constructor(freq, args) {
        super("all_active", freq);
    }

    update(pinged) {
        const watch = this.getWatching();
        for(let thing of watch) {
            if(!thing.getActive()) {
                return;
            }
        }

        GB.World.sendEvent(new SignalEvent(this.getFrequency()));
    }
}