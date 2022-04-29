class SignalEvent extends GB.Event {
    static evType() {
        return "signal_broadcast";
    }

    #frequency;

    constructor(freq) {
        super(SignalEvent.evType());

        this.#frequency = freq;
    }

    getFrequency() {
        return this.#frequency;
    }
}