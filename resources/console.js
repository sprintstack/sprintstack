importClass(com.mowforth.rhinode.dispatch.Dispatch);

var util = require('util');

var Console = function() {

  logger = Dispatch.getSystem().log();

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

}

module.exports = new Console();

