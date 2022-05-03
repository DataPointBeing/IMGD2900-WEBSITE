class Doorway extends GB.AuraObject {

    #passed = false;
    #back;

    constructor(start, end, view_pos_before, view_pos_after, back_door, old_view_bounds, new_view_bounds, view_lower_pos = null, view_upper_pos = null) {
        let inDoorway = false;
        let me;
        let free_move

        const moveRooms = function(thing) {

        };
        const leaveDoorway = function(thing) {
            if(thing.getType() === "hero") {
                if(me.goodToSwap(view_pos_after, thing)) {
                    if(free_move) {
                        GB.View.setMoveBounds(view_lower_pos, view_upper_pos);
                    } else {
                        GB.View.clearMoveBounds();
                    }

                    if(new_view_bounds) {
                        GB.View.setViewGrid(new_view_bounds.x, new_view_bounds.y);
                    }

                    GB.View.setPosition(view_pos_after);

                    me.setPassed(true);

                    const off = Doorway.getOffset(thing);
                    thing.setPosition({x: thing.getPositionX() + off.x, y: thing.getPositionY() + off.y});
                }

                //inDoorway = false;
            }
        };

        super("door", start, end, moveRooms, leaveDoorway);
        this.#back = back_door;
        free_move = view_lower_pos !== null && view_upper_pos !== null;

        me = this;
    }

    goodToSwap(v_pos, thing) {
        return !GB.Utility.positionsEqual(v_pos, GB.View.getPosition()) && !GB.View.worldInView(thing.getPosition())
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

    static getOffset(thing) {
        const pos = GB.Utility.worldToView(thing.getPosition());
        const x_diff = pos.x - (GB.View.getWidth() / 2);
        const y_diff = pos.y - (GB.View.getHeight() / 2);
        if(Math.abs(x_diff) < Math.abs(y_diff)) {
            return {x: 0, y: -1 * (y_diff / Math.abs(y_diff))};
        }
        else {
            return {x: -1 * (x_diff / Math.abs(x_diff)), y: 0};
        }
    }
}