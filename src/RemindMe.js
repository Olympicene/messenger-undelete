const Command = require('./Command.js');

// !timer set ming

module.exports = class RemindMe extends Command {

    constructor(ids) {
        super(ids);
        this.term = '!RemindMe';
        this.type = 'message';
        this.needContent = true;
        this.message = {
            body: '',
            mentions: '',
        }
    }

    doAction(event, api) {
        
        var time = super.getContent(event)[0];

        if(this.isNumeric(time) && parseInt(time) > 0) { //check if time is valid
            
            this.message.body = 'set timer for ' + parseInt(time) + ' amount of minutes'

            api.sendMessage(this.message, event.threadID, (err) => { //change send thread stuff
                if(err) return console.error(err);
            });

            this.message.body = '@Sender';

            this.message.mentions = [{
                tag: '@Sender',
                id: event.senderID,
            }];

            console.log(this.message)

            setTimeout(() => {



                api.sendMessage(this.message, event.threadID, (err) => { //change send thread stuff
                    if(err) return console.error(err);
                });

            }, parseInt(time) * 60000);

        } else {
            throw 'invalid minute number'
        }
    }

    isNumeric(num) {
        return !isNaN(num)
    }
}