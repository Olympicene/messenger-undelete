const appRoot = require("app-root-path");
const config = require(appRoot + "/database/config.js");
const fs = require("fs");
const path = require("path");

function databaseDir(name, thread) {
    return path.resolve(appRoot + `/database/${name}-${thread}.json`);
}

for (var thread in config.allowed_threads) {

    fs.writeFile(databaseDir('deleted', config.allowed_threads[thread]), '[]', { flag: 'wx' }, (err) => {
        if (!err) console.log(`deleted-${config.allowed_threads[thread]}.json has been created`);
    });
}

module.exports = class Listener {
    constructor() {
        this.type = ["message_unsend"];
    }
  
    async listen(event) {    
        if (this.type.indexOf(event.type) > -1) {
            fs.readFile(databaseDir('history',event.threadID), (err, data) => {
                var json = JSON.parse(data)
                
                var result = json.filter(msg => {
                    return msg.messageID === event.messageID;
                });

                fs.readFile(databaseDir('deleted', event.threadID), (err, thing) => {
                    var stuff = JSON.parse(thing)
                    stuff.unshift(result)
        
                    if (stuff.length > 100) {stuff.pop()}
                
                    fs.writeFile(databaseDir('deleted', event.threadID), JSON.stringify(stuff, null, '\t'), (err) => {
                        if (err) console.log(err)
                    });
                })
            });
        }
    }
}