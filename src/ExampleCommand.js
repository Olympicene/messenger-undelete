const Command = require('./Command.js');
const fetch = require("node-fetch");

module.exports = class Kanye extends Command {

    constructor(ids) {
        super(ids);
        this.term = '!Kanye';
        this.type = 'message';
        this.needContent = false;
        this.message = {
            body: '',
        }
    }

    doAction(event, api) {

        

        api.sendMessage(this.message, event.threadID, (err) => { //send thread stuff
            if(err) return console.error(err);
        });
    }  
}