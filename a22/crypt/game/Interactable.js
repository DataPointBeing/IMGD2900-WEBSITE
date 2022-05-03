class Interactable extends GB.Object {

    #label;

    constructor(type, label = null) {
        super(type);
        GB.World.registerInterest(this, InteractEvent);
        GB.World.registerInterest(this, LookEvent);

        this.#label = label;
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
            case LookEvent.evType():
                Player.setLookingAt(this.#label);
                break;
        }
    }

    handleInteract() {

    }

    setLabel(label) {
        this.#label = label;
    }

    getLabel(label) {
        return this.#label;
    }
}