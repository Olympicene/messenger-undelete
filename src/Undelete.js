const Command = require('./Command.js');

module.exports = class Undelete extends Command {

    constructor(ids) {
        super(ids);
        this.term = '!Undelete';
        this.type = 'message';
        this.needContent = false;
        this.history = [];
    }

    storeHistory(event, api, use) {
        if(event.type == 'message' || event.type == 'message_reply') {
            this.history.push(event);

            if(this.history.length > 10) {
                this.history.shift();
            }
        } 
        
        if(event.type == 'message_unsend' && !use.inTimeout(event.threadID)  && this.threadIDs.includes(event.threadID)) {
            for(var i = 0; i < this.history.length; i++) {

                if (this.history[i].messageID == event.messageID) {


                    this.messageToResponse(api, this.history[i])

                    // this.message.body = JSON.stringify(this.history[i], null, 2);

                    // api.sendMessage(this.message, event.threadID, (err) => { //change send thread stuff
                    //     if(err) return console.error(err);
                    // }, this.history[i].messageID);

                    use.threadTimeout(event.threadID);
                }
            }
        }
    }

    messageToResponse(api, msg) {
        var name = '';

        api.getUserInfo(msg.senderID, (err, ret) => {
            if(err) return console.error(err);

            for(var prop in ret) {
                name = ret[prop].name;
            }

            this.message.body = '@' + name + ' said at ' + this.formatDateTime(msg.timestamp, -5) + ': \n\n' + msg.body;

            this.message.mentions = [{
                tag: '@' + name,
                id: msg.senderID,
            }];

            api.sendMessage(this.message, msg.threadID, (err) => { //confirm timer was set
                if(err) return console.error(err);
            }, msg.messageID);
        });
    }

    ImageMessageToResponse(api, msg) {
        var name = '';

        api.getUserInfo(msg.senderID, (err, ret) => {
            if(err) return console.error(err);

            for(var prop in ret) {
                name = ret[prop].name;
            }

            this.message.body = '@' + name + ' said at ' + this.formatDateTime(msg.timestamp, -5) + ': \n\n' + msg.body+ '\n\n' + msg.attachments;

            this.message.mentions = [{
                tag: '@' + name,
                id: msg.senderID,
            }];

            api.sendMessage(this.message, msg.threadID, (err) => { //confirm timer was set
                if(err) return console.error(err);
            }, msg.messageID);
        });
    }

    formatDateTime(timeEpoch, offset){
        timeEpoch = parseInt(timeEpoch);
        var d = new Date(timeEpoch);
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);  //This converts to UTC 00:00
        var nd = new Date(utc + (3600000*offset));
        return nd.toLocaleString();
    }

    
}