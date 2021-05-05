const Command = require('./Command.js');
const fetch = require("node-fetch");
const fs = require("fs");
var path = require('path');
const snoowrap = require('snoowrap');


module.exports = class Reddit extends Command {

    constructor(ids) {
        super(ids);
        this.term = '!Reddit';
        this.type = ['message', 'message_reply'];
        this.needContent = true;
        this.message = {
            body: '',
        }
    }

    doAction(event, api) {

        const databaseDir = path.resolve(__dirname + '/../database/');

        const credentials = JSON.parse(fs.readFileSync(databaseDir + '/credentials-reddit.json', 'utf8')); //gets credentials

        const fileName = databaseDir + '/credentials-reddit.json'
        const file = require(fileName);



        if(new Date().getTime() - file.access.time > 3600000)
        {

            fetch("https://www.reddit.com/api/v1/access_token", {
                body: "grant_type=password&username=" + credentials.username + "&password=" + credentials.password,
                headers: {
                    "Authorization": credentials.clientId + ":" + credentials.clientSecret,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST"
            })
            .then((res) => res.json())
            .then((result) => {
                console.log(result)
            });


            // console.log(r)

            // file.access.time = new Date().getTime();
            // file.access.token = r.access_token 

            // fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
            //     if (err) return console.log(err);

            //     console.log(JSON.stringify(file, null, 2));
            //     console.log('writing to ' + fileName);
            // });
        }



                // const r = new snoowrap({
        //     userAgent: credentials.userAgent,
        //     clientId: credentials.clientId,
        //     clientSecret: credentials.clientSecret,
        //     username: credentials.username,
        //     password: credentials.password,
        // });

        //r.getSubreddit('snoowrap').getTop({time: 'day'}).then(console.log)
        // .then((res) => res.json())
        // .then((result) => {
        //     console.log(result[0])
        // });

        // api.sendMessage(this.message, event.threadID, (err) => { //send thread stuff
        //     if(err) return console.error(err);
        // });
    }  
}