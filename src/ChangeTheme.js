const Command = require('./Command.js');


module.exports = class ChangeTheme extends Command {

    constructor(ids) {
        super(ids);
        this.term = '!change_theme';
        this.type = 'message';
    }

    changeTheme(event, api, use) {

        if(super.checkEvent(event)) { //check if command is there

            if(!super.isContentEmpty(event)) { //check if added content is there

                for(var i = 0; i < super.getContent(event).length; i++){ //iterate through extra

                    var key = super.getContent(event)[i]; 

                    if(key in api.threadColors) { //check if key is valid
                        
                        api.changeThreadColor(api.threadColors[key], event.threadID, (err) => { //change thread emoji
                            if(err) return console.error(err);
                        });

                        break;
                    }
                }
            }
        }
    }
}