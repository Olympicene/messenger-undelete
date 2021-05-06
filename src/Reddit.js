const Command = require('./Command.js');
const fetch = require('node-fetch');
const request = require('request');
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
        var url = ''
        const download = (url, path, callback) => {
            request.head(url, (err, res, body) => {
              request(url)
                .pipe(fs.createWriteStream(path))
                .on('close', callback)
            })
        }

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

            if(topPosts[0].secure_media == null)
            {
                const path = './src/image.png'

                this.message.body = topPosts[0].title + '\n' + topPosts[0].selftext

                url = topPosts[0].url
                download(url, path, () => {
                    console.log('✅ Done!')

                    this.message.attachment = fs.createReadStream(path);

                    api.sendMessage(this.message, event.threadID, (err) => { //send thread stuff
                        if(err) return console.error(err);
                    });
                });
            } else {

                const path = './src/video.mp4'

                this.message.body = topPosts[0].title + '\n' + topPosts[0].selftext
            
                url = topPosts[0].secure_media.reddit_video.fallback_url

                download(url, path, () => {
                    console.log('✅ Done!')

                    this.message.attachment = fs.createReadStream(path);

                    api.sendMessage(this.message, event.threadID, (err) => { //send thread stuff
                        if(err) return console.error(err);
                    });
                });

            }
        }
        catch (e) {
            console.log(e)
            this.message.body = e
        }

        // api.sendMessage(this.message, event.threadID, (err) => { //send thread stuff
        //     if(err) return console.error(err);
        // });
    }
}