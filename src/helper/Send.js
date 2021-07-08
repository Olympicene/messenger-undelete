async function message(event, api, contents) {
  await new Promise((resolve) => {
    api.sendMessage(contents, event.threadID, (err) => {
      //send thread stuff
      if (err) return console.error(err);

      resolve();
    });
  });
}

module.exports.message = message;

async function error(event, api, errorMessage, replyID) {
  contents = {};
  contents.body = errorMessage;
  console.log(errorMessage);

  await new Promise((resolve) => {
    api.sendMessage(contents, event.threadID, (err) => {
      //send thread stuff
      if (err) return console.error(err);

      resolve();
    }, replyID);
  });
}

module.exports.error = error;
