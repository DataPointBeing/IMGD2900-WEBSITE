const GB = {
    Loader : class {
        static #load_fns = [];

        static addLoad(load_fn){
            this.#load_fns.push(load_fn);
        }

        static startEngine(){
            for(let loader of this.#load_fns) {
                if(loader) {
                    loader();
                }
            }

            delete GB.Loader;
        }
    },
};