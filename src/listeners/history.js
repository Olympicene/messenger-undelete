const appRoot = require("app-root-path");
const config = require(appRoot + "/database/config.js");
const fs = require("fs");
const path = require("path");

function databaseDir(thread) {
  return path.resolve(appRoot + `/database/history-${thread}.json`);
}

for (var thread in config.allowed_threads) {
  fs.writeFile(
    databaseDir(config.allowed_threads[thread]),
    "[]",
    { flag: "wx" },
    (err) => {
      if (!err)
        console.log(
          `history-${config.allowed_threads[thread]}.json has been created`
        );
    }
  );
}

module.exports = class Listener {
  constructor() {
    this.type = ["message_reply", "message"];
  }

  async listen(event) {
    if (this.type.indexOf(event.type) > -1) {
      fs.readFile(databaseDir(event.threadID), (err, data) => {
        var json = JSON.parse(data);
        json.unshift(event);

        if (json.length > config.history_length) {
          json.pop();
        }

        fs.writeFile(
          databaseDir(event.threadID),
          JSON.stringify(json, null, "\t"),
          (err) => {
            if (err) console.log(err);
          }
        );
      });
    }
  }
};
