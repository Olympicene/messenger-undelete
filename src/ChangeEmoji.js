const Command = require('./Command.js');
const runes = require('runes');

module.exports = class ChangeEmoji extends Command {

    constructor(ids) {
        super(ids);
        this.term = '!ChangeEmoji';
        this.type = ['message', 'message_reply'];
        this.needContent = true;
        this.patt = new RegExp("(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])"); //regex to find all emojis
    }

    doAction(event, api) {
        console.log('got here')

        if(this.patt.test(super.getContent(event)[0]) && runes(super.getContent(event)[0]).length == 1) {
            api.changeThreadEmoji(super.getContent(event)[0], event.threadID, (err) => { //change thread emoji
                if(err) return console.error(err);
            });
        } else {
            throw 'emoji content is invalid'
        }
    }  
}