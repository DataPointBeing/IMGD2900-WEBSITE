GB.Loader.addLoad(
    function(){


        class GBConduit {
            #type;
            #frequency;

            static #watching_sets = {};
            static #freq_conduits = {};

            constructor(type, freq) {
                this.#type = type;
                this.#frequency = freq;
            }

            static get(condType, freq, ...args) {
                if(!this.#freq_conduits[condType]) {
                    this.#freq_conduits[condType] = {};
                }

                if(this.#freq_conduits[condType][freq]) {
                    return this.#freq_conduits[condType][freq];
                }
                else {
                    const cond = new condType(freq, args);
                    this.#freq_conduits[condType][freq] = cond;
                    return cond;
                }
            }

            bind(thing) {
                if(GBConduit.#watching_sets[this.#frequency]) {
                    GBConduit.#watching_sets[this.#frequency].push(thing);
                }
                else {
                    GBConduit.#watching_sets[this.#frequency] = [thing];
                }

                thing.setConduit(this);
            }

            unbind(thing) {
                if(GBConduit.#watching_sets[this.#frequency].includes(thing)) {
                    const ind = this.#watching_sets[this.#frequency].indexOf(thing);
                    this.#watching_sets[this.#frequency].splice(ind, 1);

                    thing.setConduit(null);
                }
            }

            getWatching() {
                return GBConduit.#watching_sets[this.#frequency];
            }

            forEachWatching(fn) {
                const watching = this.getWatching();
                for(let thing of watching) {
                    fn(thing);
                }
            }

            update(pinged) {

            }

            getFrequency() {
                return this.#frequency;
            }

            static #initialized = false;
            static awaken() {
                if (!this.#initialized) {
                    GB.Conduit = GBConduit;
                }
            }
        }


        GBConduit.awaken();
    }
);