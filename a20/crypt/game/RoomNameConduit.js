class RoomNameConduit extends GB.Conduit {
    #before;
    #after;

    // ARGUMENTS: 0 is room name BEFORE, 1 is room name AFTER
    constructor(freq, args) {
        super("right_order", freq);

        this.#before = args[0];
        this.#after = args[1];
    }

    update(pinged) {
        const after = pinged.isBack()?  pinged.getPassed() : !pinged.getPassed();
        Player.setRoomName(after? this.#after : this.#before);
    }
}