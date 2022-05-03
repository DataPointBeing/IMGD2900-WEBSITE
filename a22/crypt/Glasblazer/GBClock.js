GB.Loader.addLoad(
    function() {


        class GBClock {

            #my_clock = null;

            static #ticks_elapsed = 0;
            #tick_time = 2;

            #timer_fn = function () {
                GBClock.#ticks_elapsed++;
                GB.World.throwAwayQueuedThings();

                GB.World.sendEvent(new GB.TickEvent(GBClock.#ticks_elapsed));
            }

            startLoop(tick_time = 2) {
                this.#tick_time = tick_time;
                GBClock.#ticks_elapsed = 0;
                if (this.#my_clock == null) {
                    this.#my_clock = PS.timerStart(tick_time, this.#timer_fn);
                }
            }

            stopLoop() {
                if (this.#my_clock != null) {
                    PS.timerStop(this.#my_clock);
                }
            }

            isRunning() {
                return this.#my_clock != null;
            }

            getTicksElapsed() {
                return GBClock.#ticks_elapsed;
            }

            getTimeElapsed() {
                return (GBClock.#ticks_elapsed * this.#tick_time) / 60.0;
            }

            ticksToSeconds(ticks) {
                return (ticks * this.#tick_time) / 60.0;
            }


            // A variation on the singleton pattern
            constructor() {
                if(GBClock.#initialized) {
                    throw "Attempt to re-initialize " + this.constructor.name;
                }
            }

            static #initialized = false;
            static awaken() {
                if (!this.#initialized) {
                    GB.Clock = new GBClock();
                    this.#initialized = true;
                }
            }
        }



        GBClock.awaken();
    }
);