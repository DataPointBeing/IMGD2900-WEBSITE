class LookEvent extends GB.Event {
    static evType() {
        return "look_at";
    }

    constructor() {
        super(LookEvent.evType());
    }
}