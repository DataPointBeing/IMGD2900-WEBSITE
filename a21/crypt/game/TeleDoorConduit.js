class TeleDoorConduit extends GB.Conduit {

    constructor(freq, args) {
        super("teleport_friend", freq);
    }

    update(pinged) {
        this.tryTeleportThing(pinged);
    }

    tryTeleportThing(pinged) {
        const offset = {
            x: pinged.getEnteredThing().getPositionX() - pinged.getPositionX(),
            y: pinged.getEnteredThing().getPositionY() - pinged.getPositionY()
        };

        GB.World.sendEvent(new TeleportEvent(this.getFrequency(), pinged.getEnteredThing(), offset));
        pinged.clearDoorway();
    }
}