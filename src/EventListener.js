const config = require(__dirname + "/../database/config");

module.exports = class Listener {
    constructor(api) {
        this.api = api;
    }

    receive(event) {
        if (event.threadID != undefined && config.allowed_threads.indexOf(event.threadID) > -1) {


            if (["message", "message_reply"].indexOf(event.type) > -1) {

            }

        }
    }
}