const Command = require('./Command.js');

module.exports = class Undelete extends Command {

    // constructor(ids) {
    //     super(ids);
    //     this.term = '!Undelete';
    //     this.type = ['message', 'message_reply'];
    //     this.needContent = true;
    //     this.history = [];
    //     this.personal_history = {};
    // }

    // storeHistory(event, api, use) {

    //     //stires history of everyone
    //     if(event.type == 'message' || event.type == 'message_reply') {
    //         this.history.push(event);

    //         if(this.history.length > 30) {
    //             this.history.shift();
    //         }
    //     } 

    //     //get personal history
    //     if(event.type == 'message_unsend') {

    //         if (!(String(event.senderID) in this.personal_history)) {

    //             this.personal_history[String(event.senderID)] = [];
    //         }

    //         //save past in organized list
    //         for(var i = 0; i < this.history.length; i++) {

    //             if (this.history[i].messageID == event.messageID) {

    //                 this.personal_history[String(event.senderID)].unshift(this.history[i])

    //                 if (this.personal_history[String(event.senderID)].length > 10) {

    //                     this.personal_history[String(event.senderID)].pop();
    //                 }
    //             }
    //         }
    //         //console.log(this.personal_history)
    //     }
    // }

    // doAction(event, api) {

    //      if (Object.keys(event.mentions).length == 1) {

    //         if (Object.keys(event.mentions)[0] in this.personal_history) {

    //             if (super.isNumeric(super.getContent(event)[0])) {

    //                 if (parseInt(super.getContent(event)[0])-1 >= 0 && parseInt(super.getContent(event)[0])-1 < this.personal_history[String(Object.keys(event.mentions)[0])].length) {
                        
    //                     var msg = this.personal_history[String(Object.keys(event.mentions)[0])][parseInt(super.getContent(event)[0])-1]
                    
    //                     this.messageToResponse(api, msg)
    //                 } else {

    //                     throw 'invalid index number'
    //                 }
    //             } else {

    //                 var msg = this.personal_history[String(Object.keys(event.mentions)[0])][0]
                    
    //                 this.messageToResponse(api, msg)
    //             }
    //         } else {
                
    //             throw 'no history'
    //         }
    //     } else {
                
    //         throw 'more than one mention'
    //     }
    // }

    // messageToResponse(api, msg) {
    //     var name = '';

    //     api.getUserInfo(msg.senderID, (err, ret) => {
    //         if(err) return console.error(err);

    //         for(var prop in ret) {
    //             name = ret[prop].name;
    //         }

    //         if(msg.attachments == []) {
    //             this.message.body = '@' + name + ' said at ' + this.formatDateTime(msg.timestamp, -5) + ': \n\n' + msg.body;
    //         } else {
    //             var attachments = '';

    //             for (var image in msg.attachments) {
    //                 attachments += msg.attachments[image].type + ' ' + (parseInt(image)+1) + ': \n' + msg.attachments[image].url + '\n\n'
    //             }

    //             this.message.body = '@' + name + ' said at ' + this.formatDateTime(msg.timestamp, -5) + ': \n\n' + msg.body+ '\n\n' + attachments;
    //         }
            

    //         this.message.mentions = [{
    //             tag: '@' + name,
    //             id: msg.senderID,
    //         }];

    //         api.sendMessage(this.message, msg.threadID, (err) => { //confirm timer was set
    //             if(err) return console.error(err);
    //         }, msg.messageID);
    //     });
    // }

    // formatDateTime(timeEpoch, offset){
    //     timeEpoch = parseInt(timeEpoch);
    //     var d = new Date(timeEpoch);
    //     var utc = d.getTime() + (d.getTimezoneOffset() * 60000);  //This converts to UTC 00:00
    //     var nd = new Date(utc + (3600000*offset));
    //     return nd.toLocaleString();
    // }
}