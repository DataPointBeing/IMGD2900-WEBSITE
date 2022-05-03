class TeleDoorway extends GB.AuraObject {

    #passed = false;

    #frequency;
    #in_doorway;
    #thing_that_entered = null;

    #after_view;
    #after_size;
    #after_lower_bnd;
    #after_upper_bnd;

    static room_names = {
        0xFEFFAA: "The Boring Room",
        0xCCCC89: "???",
        0xB44CD9: "The Murmuring Grotto",
        0x80CC89: ""
    };

    constructor(start, end, view_pos_after, freq, view_bounds_after = null, view_lower_pos = null, view_upper_pos = null) {
        let me;

        const moveRooms = function(thing) {
            if(thing.getType() === "hero" && !me.#in_doorway) {
                me.#in_doorway = true;

                if(!Player.isJustInDoor()) {
                    Player.goIntoDoor();

                    me.setEnteredThng(thing);
                    me.setReadyToTeleport(true);
                    if(TeleDoorway.room_names[freq]) {
                        Player.setRoomName(TeleDoorway.room_names[freq]);
                    }
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
        this.#after_size = view_bounds_after;
        this.#after_lower_bnd = view_lower_pos;
        this.#after_upper_bnd = view_upper_pos;

        this.#in_doorway = false;
    }

    doEvent(event) {
        switch(event.getType()) {
            case TeleportEvent.evType():
                //PS.debug("Incoming: " + event.getFrequency().toString(16) + ". This: " + this.getFrequency().toString(16) + "\n");
                //PS.debug((this.getPositionX() + off.x) + ", " + (this.getPositionY() + off.y) + "\n")
                if(event.getFrequency() === this.#frequency) {
                    if(this.#after_lower_bnd !== null && this.#after_upper_bnd !== null) {
                        GB.View.setMoveBounds(this.#after_lower_bnd, this.#after_upper_bnd);
                    } else {
                        GB.View.clearMoveBounds();
                    }

                    if(this.#after_size) {
                        GB.View.setViewGrid(this.#after_size.x, this.#after_size.y);
                    }

                    GB.View.setPosition(this.#after_view);

                    const off = event.getOffset();
                    event.getThingToMove().setPosition({
                        x: this.getPositionX() + off.x,
                        y: this.getPositionY() + off.y,
                    });

                    const door_off = Doorway.getOffset(event.getThingToMove());
                    event.getThingToMove().setPosition({
                        x: this.getPositionX() + door_off.x,
                        y: this.getPositionY() + door_off.y,
                    });
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