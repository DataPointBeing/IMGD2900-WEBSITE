class TeleDoorway extends GB.AuraObject {

    #passed = false;

    #frequency;
    #in_doorway;
    #thing_that_entered = null;

    #after_view;

    constructor(start, end, view_pos_after, freq) {
        let me;

        const moveRooms = function(thing) {
            if(thing.getType() === "hero" && !me.#in_doorway) {
                me.#in_doorway = true;

                if(!Player.isJustInDoor()) {
                    Player.goIntoDoor();

                    me.setEnteredThng(thing);
                    me.setReadyToTeleport(true);
                }
            }
        };
        const leaveDoorway = function(thing) {
            if(thing.getType() === "hero") {
                me.setEnteredThng(null);
                me.setReadyToTeleport(false);
                Player.exitDoor();

                me.#in_doorway = false;
            }
        };

        super("tele_door", start, end, moveRooms, leaveDoorway);

        GB.World.registerInterest(this, TeleportEvent);
        this.setPosition(start);

        me = this;
        this.#frequency = freq;
        this.#after_view = view_pos_after;
        this.#in_doorway = false;
    }

    doEvent(event) {
        switch(event.getType()) {
            case TeleportEvent.evType():
                //PS.debug("Incoming: " + event.getFrequency().toString(16) + ". This: " + this.getFrequency().toString(16) + "\n");
                //PS.debug((this.getPositionX() + off.x) + ", " + (this.getPositionY() + off.y) + "\n")
                if(event.getFrequency() === this.#frequency) {
                    const off = event.getOffset();
                    event.getThingToMove().setPosition({x: this.getPositionX() + off.x, y: this.getPositionY() + off.y});
                    GB.View.setPosition(this.#after_view);
                }
                break;
        }
    }

    setReadyToTeleport(to) {
        this.#passed = to;

        if(to) {
            this.alertConduit();
        }
    }

    setEnteredThng(to) {
        this.#thing_that_entered = to;
    }

    clearDoorway() {
        this.#in_doorway = false;
    }

    getEnteredThing() {
        return this.#thing_that_entered;
    }

    getFrequency() {
        return this.#frequency;
    }

}