const Command = require('./Command.js');

module.exports = class Undelete extends Command {

    constructor(ids) {
        super(ids);
        this.term = '!Undelete';
        this.type = 'message';
        this.needContent = false;
        this.history = [];
        this.message = {
            body: '',
        }
    }

    storeHistory(event, api, use) {
        if(event.type == 'message') {
            this.history.push(event);

            if(this.history.length > 20) {
                this.history.pop();
            }
        } 
        
        if(event.type == 'message_unsend' && !use.inTimeout(event.threadID)) {
            for(var i = 0; i < this.history.length; i++) {

                if (this.history[i].messageID == event.messageID) {

                    this.message.body = JSON.stringify(this.history[i], null, 2);

                    api.sendMessage(this.message, event.threadID, (err) => { //change send thread stuff
                        if(err) return console.error(err);
                    });

                    use.threadTimeout(event.threadID);
                }


            }
        }
    }

    
}