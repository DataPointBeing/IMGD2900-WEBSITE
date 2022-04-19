class Doorway extends GB.AuraObject {

    constructor(start, end, view_pos_before, view_pos_after) {
        let inDoorway = false;
        const moveRooms = function(thing) {
            if(thing.getType() === "hero" && !inDoorway) {
                if(GB.Utility.positionsEqual(view_pos_after, GB.View.getPosition()) && !GB.View.worldInView(thing.getPosition())) {
                    GB.View.setPosition(view_pos_before);
                }

                inDoorway = true;
            }
        };
        const leaveDoorway = function(thing) {
            if(thing.getType() === "hero") {
                if(GB.Utility.positionsEqual(view_pos_before, GB.View.getPosition()) && !GB.View.worldInView(thing.getPosition())) {
                    GB.View.setPosition(view_pos_after);
                }

                inDoorway = false;
            }
        };


        super("door", start, end, moveRooms, leaveDoorway);
    }

}