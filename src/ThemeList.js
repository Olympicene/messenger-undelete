const Command = require('./Command.js');


module.exports = class ThemeList extends Command {

    constructor(ids) {
        super(ids);
        this.term = '!theme_list';
        this.type = 'message';
        this.message = {
            body: "",
        }
    }

    getThemeList(event, api, use) {

        if(super.checkEvent(event)) { //check if command is there

            if(super.isContentEmpty(event)) { //check if no other added commands
                for (var key in api.threadColors) {
                    this.message.body += key + "\n"; //turns dictionary into string
                }
                
                api.sendMessage(this.message, event.threadID, (err) => { //change send thread stuff
                    if(err) return console.error(err);
                });
            }
        }
    }

}
