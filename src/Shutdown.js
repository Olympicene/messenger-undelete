const Command = require('./Command.js');
const runes = require('runes');

module.exports = class Shutdown extends Command {

    constructor(ids) {
        super(ids);
        this.term = '!Shutdown';
        this.type = 'message';
        this.needContent = false;
    }

    doAction(event, api) {
        this.message.body = 'Olympicene/messenger-helper uptime: ' + '0';

        api.sendMessage(this.message, event.threadID, (err) => { //change send thread stuff
            if(err) return console.error(err);
            process.exit(1)
        });

        
    }  
}