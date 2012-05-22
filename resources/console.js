importClass(com.sprintstack.dispatch.Dispatch);

var util = require('util');

var Console = function() {

  logger = Dispatch.getSystem().log();

  timer = new actor(function(msg) {
    if (!this.timestamps) this.timestamps = {};
    if (msg.constructor === String) {
      this.timestamps[msg] = new Date().getTime();
    java.lang.System.out.println(msg)
    } else {
      var id = this.timestamps[msg.end];
      if (id) {
        var endtime = new Date().getTime();
        logger.info(msg.end + util.format(": %dms", endtime - id));
      }
    }
  });

  this.log = function() {
    logger.info(util.format.apply(null, arguments));
  }

  this.info = this.log;

  this.warn = function() {
    logger.warning(util.format.apply(null, arguments));
  }

  this.error = function() {
    logger.error(util.format.apply(null, arguments));
  }

  this.time = function(id) {
    timer.send(id);
  }

  this.timeEnd = function(id) {
    timer.send({"end":id});
  }

}

module.exports = new Console();

