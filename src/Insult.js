const Command = require('./Command.js');
const fetch = require("node-fetch");

module.exports = class Insult extends Command {

    constructor(ids) {
        super(ids);
        this.term = '!Insult';
        this.type = ['message', 'message_reply'];
        this.needContent = false;
        this.message = {
            body: '',
        }
    }

    doAction(event, api) {

        fetch("https://evilinsult.com/generate_insult.php?lang=en&type=json")
        .then((res) => res.json())
        .then((result) => {
            this.message.body = result.insult;
            super.send(event, api, this.message);
        });
    }  
}