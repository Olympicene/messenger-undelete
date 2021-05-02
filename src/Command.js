const { Console } = require("console");
const runes = require('runes');


module.exports = class Commands {
    constructor(ids) {
        this.term = '!command';
        this.type = 'message_reply';
        this.needContent = false;
        this.message = {
            body: '',
            mentions: '',
        }
        this.threadIDs = ids;
    }

    secondsToHms(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
    
        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        return hDisplay + mDisplay + sDisplay; 
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
        if(event.type == this.type && this.threadIDs.includes(event.threadID)) {
            if(event.body.split(' ')[0].toUpperCase() == this.termtoUpperCase()) {
                return true; 
            }
        }
        return false;
    }

    getContent(event) { //gets added content of command
        return(event.body.split(" ").slice(1));
    }

    isContent(event){ //checks if there is no added content
        return !(event.body.split(" ").length == 1); 
    }

    cleanInput(text) { //cleans input of emojis etc
        const regex = /[^a-z0-9 _.,!"'/$]/gi;
        text = text.replace(regex, '');
        return text;
    }

    isNumeric(str) { //https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
        if (typeof str != "string") return false // we only process strings!  
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
               !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }


}

