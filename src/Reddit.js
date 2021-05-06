const Command = require('./Command.js');
const fetch = require('node-fetch');
const fs = require('fs');
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
        this.getSub(super.getContent(event)[0], event, api)
    }  

    async getSub(sub, event, api) {
        const databaseDir = path.resolve(__dirname + '/../database/');
        const credentials = JSON.parse(fs.readFileSync(databaseDir + '/credentials-reddit.json', 'utf8')); //gets credentials

        const r = new snoowrap({
            userAgent: credentials.userAgent,
            clientId: credentials.clientId,
            clientSecret: credentials.clientSecret,
            username: credentials.username,
            password: credentials.password,
        });

        const subreddit = await r.getSubreddit(sub);
        const topPosts = await subreddit.getTop({time: 'day', limit: 1});

        try {
            console.log(topPosts[0].title)
            console.log(topPosts[0].selftext)

            this.message.body = topPosts[0].title + '\n' + topPosts[0].selftext
            //console.log(topPosts[0].secure_media)
        }
        catch (e) {
            console.log(e)
            this.message.body = e
        }

        api.sendMessage(this.message, event.threadID, (err) => { //send thread stuff
            if(err) return console.error(err);
        });
    }
}