const fs = require("fs");
var path = require('path');
const login = require("facebook-chat-api");


const databaseDir = path.resolve(__dirname + '/../database/');

const credentials = JSON.parse(fs.readFileSync(databaseDir + '/credentials.json', 'utf8'));

login(credentials, (err, api) => {
    if(err) return console.error(err);

    fs.writeFileSync(databaseDir + '/appstate.json', JSON.stringify(api.getAppState()));
});