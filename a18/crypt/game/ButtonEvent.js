class ButtonEvent extends GB.Event {
    static evType() {
        return "button_press";
    }

    #frequency;

    constructor(freq) {
        super(ButtonEvent.evType());

        this.#frequency = freq;
    }

    getFrequency() {
        return this.#frequency;
    }
}