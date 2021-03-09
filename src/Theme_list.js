const fs = require("fs");
const Command = require('./Command.js');
const login = require("facebook-chat-api");
const runes = require('runes');

module.exports = class Theme_list extends Command {

    constructor(ids) {
        super(ids);
        this.term = '!theme_list';
        this.type = 'message';
        this.message = {
            body: "",
        }
    }

    getTheme(event, api, use) {
        if(super.checkEvent(event)) {

            if(super.isContentEmpty(event)) {
                for (var key in api.threadColors) {
                    this.message.body += key + "\n";
                }
                
                api.sendMessage(this.message, event.threadID, (err) => { //change send thread stuff
                    if(err) return console.error(err);
                });
            }
        }
    }

}
