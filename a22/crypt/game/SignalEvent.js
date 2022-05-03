class SignalEvent extends GB.Event {
    static evType() {
        return "signal_broadcast";
    }

    #frequency;
    #tri;

    constructor(freq, tri = false) {
        super(SignalEvent.evType());

        this.#frequency = freq;
        this.#tri = tri;
    }

    getFrequency() {
        return this.#frequency;
    }

    getIsTri() {
        return this.#tri;
    }
}