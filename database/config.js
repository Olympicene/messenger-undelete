exports.timeout_milliseconds = 1000;

exports.allowed_threads = [
  "2401681243197992",
  "4432056806822983",
  "4341136652627262",
  "4258360417509656",
];

exports.ignored_commands = [
  "Command",
  "Timeout",
  "Undelete",
  "ExampleCommand",
  "Shutdown",
  "Meme",
];

exports.apiOptions = {
  listenEvents: true,
  selfListen: false,
  forceLogin: true,
}

exports.DEBUG = true;