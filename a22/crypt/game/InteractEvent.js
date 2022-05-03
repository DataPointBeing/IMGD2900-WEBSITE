class InteractEvent extends GB.Event {
    static evType() {
        return "interact";
    }

    constructor() {
        super(InteractEvent.evType());
    }
}