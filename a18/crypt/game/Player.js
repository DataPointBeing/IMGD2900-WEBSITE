class Player extends GB.Object {

    move_delay = 4;

    spacebar_down = false;


    ticks_since_last_move_h = this.move_delay;
    ticks_since_last_move_v = this.move_delay;

    constructor() {
        super("hero");

        GB.World.registerInterest(this, GB.InputEvent);
        GB.World.registerInterest(this, GB.TickEvent);
    }

    doEvent(event) {
        switch(event.getType()) {
            case GB.InputEvent.evType():
                this.#doAction(event.getInput(), event.getIsDown());
                break;
            case GB.TickEvent.evType():
                this.ticks_since_last_move_h++;
                this.ticks_since_last_move_v++;
                break;
        }
    }

    populate(pos) {
        PS.color(pos.x, pos.y, 0x174955);
        PS.alpha(pos.x, pos.y, PS.ALPHA_OPAQUE);
        PS.radius(pos.x, pos.y, 20);
        PS.data(pos.x, pos.y, 1);
    }

    dePopulate(pos) {
        PS.color(pos.x, pos.y, PS.COLOR_WHITE);
        PS.alpha(pos.x, pos.y, PS.ALPHA_TRANSPARENT);
        PS.radius(pos.x, pos.y, 0);
        PS.data(pos.x, pos.y, null);
    }

    #doAction(key, down){
        switch(key){
            case GB.InputType.UP:
            case GB.InputType.DOWN:
                this.#tryMove(key, true, down);
                break;
            case GB.InputType.LEFT:
            case GB.InputType.RIGHT:
                this.#tryMove(key, false, down);
                break;
            case GB.InputType.SPACE:
                this.#tryInteract(down);
                return;
        }
    }

    #tryInteract(down) {
        if(down && !this.spacebar_down) {
            this.spacebar_down = true;
            for(let x = -1; x < 2; x++){
                for(let y = -1; y < 2; y++){
                    if(Math.abs(x) === Math.abs(y)) {
                        continue;
                    }

                    const w_pos = {x: super.getPosition().x + x, y: super.getPosition().y + y};
                    const v_pos = GB.Utility.worldToView(w_pos);
                    if(GB.View.inView(v_pos) && PS.data(v_pos.x, v_pos.y) > 1) {
                        const thing = GB.World.objectFromID(PS.data(v_pos.x, v_pos.y));
                        if(thing !== null) {
                            thing.doEvent(new InteractEvent());
                        }
                    }
                }
            }
        }
        else if(!down) {
            this.spacebar_down = false;
        }
    }

    #tryMove(dir, vert, down){
        if(down && ((vert? this.ticks_since_last_move_v : this.ticks_since_last_move_h) >= this.move_delay)) {
            switch (dir) {
                case GB.InputType.UP:
                    super.setPositionY(super.getPositionY() - 1);
                    break;
                case GB.InputType.DOWN:
                    super.setPositionY(super.getPositionY() + 1);
                    break;
                case GB.InputType.LEFT:
                    super.setPositionX(super.getPositionX() - 1);
                    break;
                case GB.InputType.RIGHT:
                    super.setPositionX(super.getPositionX() + 1);
                    break;
            }

            if(vert) {
                this.ticks_since_last_move_v = 0;
            }
            else {
                this.ticks_since_last_move_h = 0;
            }
        }
    }
}