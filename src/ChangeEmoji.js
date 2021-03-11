const Command = require('./Command.js');
const runes = require('runes');

module.exports = class ChangeEmoji extends Command {

    constructor(ids) {
        super(ids);
        this.term = '!emoji';
        this.type = 'message';
        this.patt = new RegExp("(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])"); //regex to find all emojis
    }

    changeEmoji(event, api, use) {
        if(super.checkEvent(event)) { //check if message type and term is valid

            for (const item of runes(event.body)) { //goes through message

                if(this.patt.test(item)) { //identifies first emoji

                    api.changeThreadEmoji(item, event.threadID, (err) => { //change thread emoji
                        if(err) return console.error(err);
                    });

                    use.threadTimeout(event.threadID); //starts timeout
                } 
            }
        }
    }
  
}