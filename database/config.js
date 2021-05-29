exports.timeout_milliseconds = 1000;

exports.prefix = "!";

exports.allowed_threads = [
  "2401681243197992",
  "4432056806822983",
  "4341136652627262",
  "4258360417509656",
];

exports.ignored_commands = [
  "Command",
  "ExampleCommand",
];

exports.ignored_listeners = [
  "TEMPORARY_DELETE_LATER",
];

exports.apiOptions = {
  listenEvents: true,
  selfListen: false,
  forceLogin: true,
};

exports.DEBUG = false;
