class NameChange {
    #inner_thing;

    constructor(thing, new_name) {
        this.#inner_thing = thing;

        thing.setLabel(new_name);
    }
}