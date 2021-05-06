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


        var thing = ''
        var url = ''

        try {
            const subreddit = await r.getSubreddit(sub);
            const topPosts = await subreddit.getTop({time: 'day', limit: 2});
        
            const post = topPosts[0]

            try {
                if (!post.quarantine && !post.over_18) {

                    this.message.body = post.title + '\n' + post.selftext

                    if (post.domain == 'v.redd.it') {
                        thing = './src/video.mp4'
                
                        url = post.secure_media.reddit_video.fallback_url

                    } else if (post.domain == 'i.redd.it') {
                        thing = './src/image.png'

                        url = post.url

                    } else {
                        this.message.body += post.url
                    }
                } else {
                    this.message.body = "that post is 18+ im not doing that again"
                }
            }
            catch (e) {
                this.message.body = e
            }

        } catch (e) {
            this.message.body = "something has gone horribly wrong. what cursed subreddit did you ask for?"
        }


        if (thing != '') {
            download(url, thing, () => {
                console.log('✅ Done!')
    
                this.message.attachment = fs.createReadStream(thing);

                api.sendMessage(this.message, event.threadID, (err) => { //send thread stuff
                    if(err) return console.error(err);
                });
            });
        } else {
            api.sendMessage(this.message, event.threadID, (err) => { //send thread stuff
                if(err) return console.error(err);
            });
        }
    }
}