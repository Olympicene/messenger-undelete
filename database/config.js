exports.timeout_milliseconds = 1000;

exports.prefix = "!";

exports.history_length = 2000;

exports.deleted_length = 1000;

exports.allowed_threads = [
  "2401681243197992",
  "4432056806822983",
  "4341136652627262",
  "4258360417509656",
];

exports.ignored_commands = [
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
