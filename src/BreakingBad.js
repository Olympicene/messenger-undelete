const Command = require('./Command.js');
const fetch = require("node-fetch");

module.exports = class BreakingBad extends Command {

    constructor(ids) {
        super(ids);
        this.term = '!BreakingBad';
        this.type = ['message', 'message_reply'];
        this.needContent = false;
        this.message = {
            body: '',
        }
    }

    doAction(event, api) {

        fetch("https://breaking-bad-quotes.herokuapp.com/v1/quotes")
        .then((res) => res.json())
        .then((result) => {
            this.message.body = result[0].quote + '\n\n-' + result[0].author;
            super.send(event, api, this.message);
        });
    }    
}