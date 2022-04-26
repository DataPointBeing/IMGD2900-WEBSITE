class Doorway extends GB.AuraObject {

    #passed = false;
    #back;

    constructor(start, end, view_pos_before, view_pos_after, back_door, old_view_bounds, new_view_bounds) {
        let inDoorway = false;
        let me;

        const moveRooms = function(thing) {
            if(thing.getType() === "hero" && !inDoorway) {
                //PS.debug("Want: " + view_pos_after.x + ", " + view_pos_after.y + ". Now: " + GB.View.getPositionX() + ", " + GB.View.getPositionY() + "\n");
                if(GB.Utility.positionsEqual(view_pos_after, GB.View.getPosition()) && !GB.View.worldInView(thing.getPosition())) {
                    GB.View.setPosition(view_pos_before);
                    if(old_view_bounds) {
                        GB.View.setViewGrid(old_view_bounds.x, old_view_bounds.y);
                    }

                    me.setPassed(false);
                }

                inDoorway = true;
            }
        };
        const leaveDoorway = function(thing) {
            if(thing.getType() === "hero") {
                if(GB.Utility.positionsEqual(view_pos_before, GB.View.getPosition()) && !GB.View.worldInView(thing.getPosition())) {
                    GB.View.setPosition(view_pos_after);
                    if(new_view_bounds) {
                        GB.View.setViewGrid(new_view_bounds.x, new_view_bounds.y);
                    }

                    me.setPassed(true);
                }

                inDoorway = false;
            }
        };

        super("door", start, end, moveRooms, leaveDoorway);
        this.#back = back_door;

        me = this;
    }

    getPassed() {
        return this.#passed;
    }

    isBack() {
        return this.#back;
    }

    setPassed(to) {
        this.#passed = to;
        this.alertConduit();
    }

}