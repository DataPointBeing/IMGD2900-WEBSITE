class TeleportEvent extends GB.Event {
    static evType() {
        return "tele_broadcast";
    }

    #frequency;
    #thing_offset;
    #thing_to_move;

    constructor(freq, thing, offset) {
        super(TeleportEvent.evType());

        this.#frequency = freq;
        this.#thing_offset = offset;
        this.#thing_to_move = thing;
    }

    getFrequency() {
        return this.#frequency;
    }

    getOffset() {
        return this.#thing_offset;
    }

    getThingToMove() {
        return this.#thing_to_move;
    }
}