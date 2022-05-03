class TriLightBulb extends GB.Object {

    #frequency;

    #color;
    #mask;

    #active;

    constructor(x, y, freq, start_active = false, color = 0xBACE66) {
        super("tri_bulb");
        this.setPosition({x:x, y:y});

        this.#active = start_active;
        this.#color = color;
        this.#frequency = freq;

        const hex_freq = ('000000'+freq.toString(16)).slice(-6);
        const hex_pairs = [hex_freq.substring(0,2), hex_freq.substring(2,4), hex_freq.substring(4,6)];
        let mask = '';
        for(let pair of hex_pairs) {
            mask += pair === '00'? '00' : 'FF';
        }
        this.#mask = parseInt(mask, 16);

        GB.World.registerInterest(this, SignalEvent);
        GB.World.registerInterest(this, GB.TickEvent);
    }

    doEvent(event) {
        switch(event.getType()) {
            case SignalEvent.evType():
                if(event.getIsTri() && (event.getFrequency() & this.#mask) === this.#frequency) {
                    this.#active = !this.#active;
                    this.refresh();
                }
                break;
            case GB.TickEvent.evType():
                this.alertConduit();
                break;
        }
    }

    populate(pos) {
        PS.color(pos.x, pos.y, this.#active? this.#color : 0x202020);
        PS.alpha(pos.x, pos.y, PS.ALPHA_OPAQUE);
        PS.borderAlpha(pos.x, pos.y, PS.ALPHA_OPAQUE);
        PS.radius(pos.x, pos.y, 10);
        PS.border(pos.x, pos.y, 4);
        PS.borderColor(pos.x, pos.y, 0x636363);
        PS.data(pos.x, pos.y, 1);
    }

    dePopulate(pos) {
        PS.color(pos.x, pos.y, PS.COLOR_WHITE);
        PS.alpha(pos.x, pos.y, PS.ALPHA_TRANSPARENT);
        PS.borderAlpha(pos.x, pos.y, PS.ALPHA_TRANSPARENT);
        PS.radius(pos.x, pos.y, 0);
        PS.border(pos.x, pos.y, 0);
        PS.data(pos.x, pos.y, null);
    }

    getActive() {
        return this.#active;
    }
}