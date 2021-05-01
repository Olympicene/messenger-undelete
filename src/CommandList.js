const Command = require('./Command.js');
const glob = require('glob');

module.exports = class CommandList extends Command {

    constructor(ids) {
        super(ids);
        this.term = '!CommandList';
        this.type = 'message';
        this.needContent = false;
        this.message = {
            body: '',
        }
    }

    doAction(event, api) {

        var commandList = [];
        var ignoredList = ['Command', 'Timeout', 'Undelete', 'ExampleCommand'];

        glob.sync( './src/*.js' ).forEach( function(file) {
            if(!ignoredList.map(command => './src/' + command + '.js').includes(file)) {
                commandList.push(file.slice(6,-3))
            }
            
        });

        commandList = commandList.map(command => '!' + command + '\n');

        for(var command in commandList) {
            this.message.body += commandList[command];
        }

        api.sendMessage(this.message, event.threadID, (err) => { //send thread stuff
            if(err) return console.error(err);
        });
    }  
}