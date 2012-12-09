importClass(java.lang.System);

var util = require('util');
var queue = require('queue');

var Logger = function() {

  var outQueue = new queue();
  var errQueue = new queue();

  this.out = function(msg) {
    outQueue.push(function() {
      System.out.println(msg);
    });
  }

  this.err = function(msg) {
    errQueue.push(function() {
      System.err.println(msg);
    });
  }
};


var Console = function() {
  logger = new Logger();

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
    this.warn("time() not implemented!");
  }

  this.timeEnd = function(id) {
    this.warn("timeEnd() not implemented!");
  }

}

module.exports = new Console();

