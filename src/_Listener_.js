

module.exports = class Listener {
    constructor(event, api, use) {
        this.event = event;
        this.api = api;
        this.use = use;
    }
}