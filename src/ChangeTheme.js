const Command = require('./Command.js');


module.exports = class ChangeTheme extends Command {

    constructor(ids) {
        super(ids);
        this.term = '!ChangeTheme';
        this.type = 'message';
        this.needContent = true;
        this.message = {
            body: '',
        }
    }

    doAction(event, api) {
        
        var key = super.getContent(event)[0];
        if(key in api.threadColors) { //check if key is valid
                        
            api.changeThreadColor(api.threadColors[key], event.threadID, (err) => { //change thread emoji
                if(err) return console.error(err);
            });
        } else {
            throw "color key is invalid"
        }
    }
}