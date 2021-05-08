const Command = require('./Command.js');
const fetch = require("node-fetch");

module.exports = class Kanye extends Command {

    constructor(ids) {
        super(ids);
        this.term = '!Kanye';
        this.type = ['message', 'message_reply'];
        this.needContent = false;
        this.message = {
            body: '',
        }
    }

    doAction(event, api) {

        fetch("https://api.kanye.rest/")
        .then((res) => res.json())
        .then((result) => {
            this.message.body = result.quote + '\n\n' + '-Kanye West';
            super.send(event, api, this.message);
        });
    }  
}