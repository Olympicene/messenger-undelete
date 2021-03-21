const Command = require('./Command.js');
var parse = require('parse-duration')


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
        
        var name = '';

        var time = super.getContent(event).join(' ');

        if(parse(time) != null) { //check if time is valid

            api.getUserInfo(event.senderID, (err, ret) => {
                if(err) return console.error(err);

                for(var prop in ret) {
                    name = ret[prop].name;
                }

                this.message.body = 'will remind ' + name + ' in ' + parse(time) + ' milliseconds'

                api.sendMessage(this.message, event.threadID, (err) => { //confirm timer was set
                    if(err) return console.error(err);
                });

                this.message.body = '@' + name;

                this.message.mentions = [{
                    tag: '@' + name,
                    id: event.senderID,
                }];
    
                setTimeout(() => {

                    api.sendMessage(this.message, event.threadID, (err) => { //send thread stuff
                        if(err) return console.error(err);
                    });

                }, parse(time));
            });

        } else {
            throw 'invalid minute number'
        }
    }

    isNumeric(num) {
        return !isNaN(num)
    }
}