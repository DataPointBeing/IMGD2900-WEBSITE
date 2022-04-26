class Player extends GB.Object {

    move_delay = 4;

    spacebar_down = false;

    static #room_name;
    static #timer_start;

    static #timer_active = true;
    static #final_time;

    static #key;

    //static #;

    ticks_since_last_move_h = this.move_delay;
    ticks_since_last_move_v = this.move_delay;

    constructor(x = 0, y = 0) {
        super("hero");

        GB.World.registerInterest(this, GB.InputEvent);
        GB.World.registerInterest(this, GB.TickEvent);

        Player.#room_name = null;
        Player.#timer_start = 0;
        Player.#final_time = 0;

        Player.#key = null;

        super.setPosition({x:x, y:y});
    }

    doEvent(event) {
        switch(event.getType()) {
            case GB.InputEvent.evType():
                this.#doAction(event.getInput(), event.getIsDown());
                break;
            case GB.TickEvent.evType():
                this.ticks_since_last_move_h++;
                this.ticks_since_last_move_v++;
                Player.#updateStatus();
                break;
        }
    }

    static setKey(k) {
        this.#key = k;
    }

    static getKey(k) {
        return this.#key;
    }

    static setRoomName(name) {
        if(this.#room_name === null) {
            Player.#timer_start = GB.Clock.getTicksElapsed();
        }

        Player.#room_name = name;
    }

    getRoomName(name) {
        return Player.#room_name;
    }

    static timerInSeconds() {
        const sec = parseInt(GB.Clock.ticksToSeconds(GB.Clock.getTicksElapsed() - Player.#timer_start));

        const minutes = Math.floor(sec / 60);
        let seconds = sec % 60;
        if (seconds.toString().length < 2) {
            seconds = '0' + seconds;
        }
        return minutes + ":" + seconds;
    }

    static finishTime() {
        const sec = parseInt(GB.Clock.ticksToSeconds(Player.#final_time - Player.#timer_start));

        const minutes = Math.floor(sec / 60);
        let seconds = sec % 60;
        if (seconds.toString().length < 2) {
            seconds = '0' + seconds;
        }
        return minutes + ":" + seconds;
    }

    static setTimerActive(set) {
        this.#timer_active = set;
        if(!set) {
            this.#final_time = GB.Clock.getTicksElapsed();
            PS.statusText("You win! Final time: " + Player.finishTime());
        }
    }

    static #updateStatus() {
        if(Player.#room_name === null) {
            PS.statusText("WASD/arrows to move, Spacebar to interact");
        }
        else if(this.#timer_active) {
            PS.statusText(Player.timerInSeconds() + " -- " + Player.#room_name);
        }
    }

    populate(pos) {
        PS.alpha(pos.x, pos.y, PS.ALPHA_OPAQUE);
        PS.radius(pos.x, pos.y, 20);
        PS.data(pos.x, pos.y, 1);

        if(Player.#key === null) {
            PS.color(pos.x, pos.y, 0x206E81);
        }
        else {
            PS.border(pos.x, pos.y, 6);
            PS.borderAlpha(pos.x, pos.y, PS.ALPHA_OPAQUE);
            PS.borderColor(pos.x, pos.y, 0x206E81);
            PS.color(pos.x, pos.y, Player.#key);
        }
    }

    dePopulate(pos) {
        PS.color(pos.x, pos.y, PS.COLOR_WHITE);
        PS.alpha(pos.x, pos.y, PS.ALPHA_TRANSPARENT);
        PS.radius(pos.x, pos.y, 0);
        PS.border(pos.x, pos.y, 0);
        PS.borderAlpha(pos.x, pos.y, 0);
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

                    this.refresh();
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