const { Console } = require("console");
const runes = require('runes');


module.exports = class Commands {
    constructor(ids) {
        this.term = '!command';
        this.type = 'message_reply';
        this.needContent = false;
        this.message = {
            body: '',
        }
        this.threadIDs = ids;
    }

    listen(event, api, use) {
        if(this.checkEvent(event)) {
            if(this.needContent == this.isContent(event)) {
                try {
                    this.doAction(event, api);
                    use.threadTimeout(event.threadID);
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }

    doAction(event, api) { //abstract
        throw "Abstract method not implemented";
    };

    checkEvent(event) { //check if message type and term is valid
        if(event.type == this.type) {
            if(event.body.split(' ')[0] == this.term) {
                return true; 
            }
        }
        return false;
    }

    getContent(event) { //gets added content of command
        if(event.type == this.type) {
            return(event.body.split(" ").slice(1));
        }
    }

    isContent(event){ //checks if there is no added content
        return !(event.body.split(" ").length == 1); 
    }

    cleanInput(text) { //cleans input of emojis etc
        const regex = /[^a-z0-9 _.,!"'/$]/gi;
        text = text.replace(regex, '');
        return text;
    }


}

