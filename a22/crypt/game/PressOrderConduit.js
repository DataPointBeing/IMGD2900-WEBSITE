class PressOrderConduit extends GB.Conduit {
    #order;
    #progress;

    // ARGUMENTS: 0 is order
    constructor(freq, args) {
        super("right_order", freq);

        this.#order = args[0];
        this.#progress = 0;
    }

    update(pinged) {
        if(pinged.getFrequency() === this.#order[this.#progress]) {
            this.#progress++;
            if(this.#progress >= this.#order.length) {
                GB.World.sendEvent(new SignalEvent(this.getFrequency()));
                PS.audioPlay("fx_powerup7", {volume: 0.5});
                this.#progress = 0;
            }
        }
        else {
            this.#progress = 0;
        }
    }
}