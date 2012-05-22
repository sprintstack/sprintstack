importClass(java.lang.System);

var util = require('util');

// Accepts log message in the format {"t":x,"p":y}
// where t = type, p = payload
var Logger = function() {

  var internalLogger = new actor(function(msg) {
    if (msg.t == "err") System.err.println(msg.p);
    if (msg.t == "out") System.out.println(msg.p);
  });

  this.out = function(msg) {
    internalLogger.send({"t":"out","p":msg});
  }

  this.err = function(msg) {
    internalLogger.send({"t":"err","p":msg});
  }

}

var Console = function() {

  logger = new Logger();

  timer = new actor(function(msg) {
    if (msg.constructor === String) {
      this.timestamps[msg] = new Date().getTime();
    } else {
      var id = this.timestamps[msg.end];
      if (id) {
        var endtime = new Date().getTime();
        delete this.timestamps[msg.end];
        logger.out(msg.end + util.format(": %dms", endtime - id));
      }
    }
  }, {prestart: function() {
    this.timestamps = {};
  }});

  this.log = function() {
    var str = util.format.apply(null, arguments);
    logger.out(str);
  }

  this.info = this.log;

  this.warn = function() {
    var str = util.format.apply(null, arguments);
    logger.err(str);
  }

  this.error = this.warn;

  this.time = function(id) {
    timer.send(id);
  }

  this.timeEnd = function(id) {
    timer.send({"end":id});
  }

}

module.exports = new Console();

