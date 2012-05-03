importClass(com.mowforth.rhinode.dispatch.Dispatch);

var util = require('util');

var Console = function() {

  this.log = function(msg) {
    this.logger.info(msg);
  }

  this.info = function(msg) {
    this.log(msg);
  }

  this.warn = function(msg) {
    this.logger.warning(msg);
  }

  this.error = function(msg) {
    this.logger.error(msg);
  }

}

Console.prototype.logger = Dispatch.getSystem().log();

module.exports = new Console();

