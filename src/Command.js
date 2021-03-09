const { Console } = require("console");

module.exports = class Commands {

    constructor(ids) {
        this.term = '!command';
        this.type = 'message_reply';
        this.threadIDs = ids;
    }

    cleanInput(text) { //cleans input of emojis etc
        const regex = /[^a-z0-9 _.,!"'/$]/gi;
        text = text.replace(regex, '');
        return text;
    }

    checkEvent(event) { //check if message type and term is valid
        if(event.type == this.type) {

            if(event.body.substring(0, this.term.length) == this.term) {
                return true; 
            }
        }
        return false;
    }

    getContent(event) { //gets added content of command
        if(event.type == this.type) {
            return(this.cleanInput(event.body.substring(this.term.length, event.body.length)).split(" "));
        }
    }

    isContentEmpty(event){ //checks if there is no added content
        return this.getContent(event).length == 1 && this.getContent(event)[0] == ''; 
    }


}