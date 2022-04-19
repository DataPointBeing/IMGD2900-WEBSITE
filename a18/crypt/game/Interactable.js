class Interactable extends GB.Object {

    constructor(type) {
        super(type);
        GB.World.registerInterest(this, InteractEvent)
    }

    populate(pos) {
        PS.data(pos.x, pos.y, super.getID());
    }

    dePopulate(pos) {
        PS.data(pos.x, pos.y, null);
    }

    doEvent(event) {
        switch(event.getType()) {
            case InteractEvent.evType():
                this.handleInteract();
                break;
        }
    }

    handleInteract() {

    }

}