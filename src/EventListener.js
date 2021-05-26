

module.exports = class Listener {
    constructor(api) {
        this.api = api;
    }

    receive(event) {
        console.log("i have received an event");
    }
}