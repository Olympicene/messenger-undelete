const Command = require('./Command.js');

module.exports = class ThemeList extends Command {

    constructor(ids) {
        super(ids);
        this.term = '!ThemeList';
        this.type = ['message', 'message_reply'];
        this.needContent = false;
        this.message = {
            body: '',
        }
    }

    doAction(event, api) {

        this.message.body = ''; //dont delete

        for (var key in api.threadColors) {
            this.message.body += key + "\n"; //turns dictionary into string
        }

        api.sendMessage(this.message, event.threadID, (err) => { //change send thread stuff
            if(err) return console.error(err);
        });
    }
}


