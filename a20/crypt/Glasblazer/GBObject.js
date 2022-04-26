GB.Loader.addLoad(
    function(){


        class GBObject {
            #type;
            #id;
            #position;
            #plane;

            #triggers_auras;

            #draw_from_outside;

            #draw_overridden;

            #deleted;

            #pop_overrides = [];
            #dePop_overrides = [];

            #conduit = null;

            constructor(type) {
                this.#type = type;
                this.#deleted = false;
                this.#position = {x: 0, y: 0};
                this.#plane = 0;
                this.#draw_from_outside = false;
                this.#triggers_auras = true;

                this.#draw_overridden = false;

                GB.World.hello(this);

                //this.populate(this.#position);
            }

            setGridPlane(new_plane) {
                if(new_plane !== this.#plane) {
                    this.#dePopulateObject();
                    this.#plane = new_plane;
                    this.#populateObject();
                }
            }

            setDrawOutside(do_it = true) {
                this.#draw_from_outside = do_it;
            }

            getDrawOutside() {
                return this.#draw_from_outside;
            }

            setDrawOverridden(is_it) {
                this.#draw_overridden = is_it;
            }

            getDrawOverridden() {
                return this.#draw_overridden;
            }

            setTriggersAuras(well_does_it) {
                this.#triggers_auras = well_does_it;
            }

            getTriggersAuras() {
                return this.#triggers_auras;
            }

            getGridPlane() {
                return this.#plane;
            }

            getPosition() {
                return this.#position;
            }

            getPositionX() {
                return this.#position.x;
            }

            getPositionY() {
                return this.#position.y;
            }

            setPosition(new_pos) {
                let new_pos_conv;
                if(Array.isArray(new_pos)){
                    new_pos_conv = {x: new_pos[0], y: new_pos[1]};
                }
                else {
                    new_pos_conv = new_pos;
                }

                if(new_pos_conv !== this.#position && !GB.World.collision(new_pos.x, new_pos.y)) {
                    const old_pos = {x: this.#position.x, y: this.#position.y};

                    this.#dePopulateObject();
                    this.#position = new_pos;
                    this.#populateObject();

                    const auras = this.#checkAuras(true, this.#position);
                    this.#checkAuras(false, old_pos, auras);
                }
            }

            setPositionX(new_x) {
                if(new_x !== this.#position.x && !GB.World.collision(new_x, this.#position.y)) {
                    const old_pos = {x: this.#position.x, y: this.#position.y};

                    this.#dePopulateObject();
                    this.#position.x = new_x;
                    this.#populateObject();

                    const auras = this.#checkAuras(true, this.#position);
                    this.#checkAuras(false, old_pos, auras);
                }
            }

            setPositionY(new_y) {
                if(new_y !== this.#position.y && !GB.World.collision(this.#position.x, new_y)) {
                    const old_pos = {x: this.#position.x, y: this.#position.y};

                    this.#dePopulateObject();
                    this.#position.y = new_y;
                    this.#populateObject();

                    const auras = this.#checkAuras(true, this.#position);
                    this.#checkAuras(false, old_pos, auras);
                }
            }

            #checkAuras(just_in, pos, already_hit) {
                if(!this.#triggers_auras) {
                    return [];
                }

                let check_against = [];
                if(already_hit) {
                    check_against = already_hit;
                }

                const auras_hit = [];

                const auras = GB.World.aurasAt(pos.x, pos.y);
                if(auras) {
                    for (let aura of auras) {
                        if (aura !== null && !check_against.includes(aura)) {
                            const letsDo = just_in? aura.in : aura.out;
                            if(letsDo) {
                                letsDo(this);
                                auras_hit.push(aura);
                            }
                        }
                    }
                }

                return auras_hit;
            }

            getType() {
                return this.#type;
            }

            getID() {
                return this.#id;
            }

            setID(new_id) {
                this.#id = new_id;
            }

            setConduit(cond) {
                this.#conduit = cond;
            }

            getConduit() {
                return this.#conduit;
            }

            clearConduit() {
                if(this.#conduit !== null) {
                    this.#conduit.unbind(this);
                }
            }

            alertConduit() {
                if(this.#conduit !== null) {
                    this.#conduit.update(this);
                }
            }

            doEvent(event) {

            }

            refresh() {
                const v_pos = GB.Utility.worldToView(this.#position);
                if((GB.View.inView(v_pos) || this.#draw_from_outside) && !this.#draw_overridden) {
                    PS.gridPlane(this.#plane);

                    this.dePopulate(v_pos);
                    this.#overridePop(v_pos);
                    this.populate(v_pos);
                    this.#overrideDePop(v_pos);

                    PS.gridPlane(PS.DEFAULT);
                }
            }

            drawToView() {
                this.#populateObject();
            }

            removeFromView() {
                this.#dePopulateObject();
            }

            #populateObject(){
                const v_pos = GB.Utility.worldToView(this.#position);
                if((GB.View.inView(v_pos) || this.#draw_from_outside) && !this.#draw_overridden) {
                    PS.gridPlane(this.#plane);
                    this.populate(v_pos);
                    this.#overridePop(v_pos);
                    PS.gridPlane(PS.DEFAULT);
                }
            }

            #dePopulateObject(){
                const v_pos = GB.Utility.worldToView(this.#position);
                if((GB.View.inView(v_pos) || this.#draw_from_outside) && !this.#draw_overridden) {
                    PS.gridPlane(this.#plane);
                    this.dePopulate(v_pos);
                    this.#overrideDePop(v_pos);
                    PS.gridPlane(PS.DEFAULT);
                }
            }

            dePopulate(pos) {
                PS.color(pos.x, pos.y, PS.COLOR_WHITE);
                PS.alpha(pos.x, pos.y, PS.ALPHA_TRANSPARENT);
                PS.radius(pos.x, pos.y, 0);
                PS.data(pos.x, pos.y, null);
            }

            populate(pos) {

            }

            addPopOverride(over) {
                this.#pop_overrides.push(over);
            }

            #overridePop(pos) {
                for(let over of this.#pop_overrides) {
                    over(pos);
                }
            }

            addDePopOverride(over) {
                this.#dePop_overrides.push(over);
            }

            #overrideDePop(pos) {
                for(let over of this.#dePop_overrides) {
                    over(pos);
                }
            }

            isDeleted() {
                return this.#deleted;
            }

            deleteObject() {
                this.beforeWeGo();

                this.#deleted = true;
                this.#dePopulateObject();

                this.#checkAuras(false, this.#position);

                GB.World.goodbye(this);
            }

            beforeWeGo() {

            }


            static #initialized = false;
            static awaken() {
                if (!this.#initialized) {
                    GB.Object = GBObject;
                }
            }
        }


        GBObject.awaken();
    }
);