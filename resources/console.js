importClass(com.mowforth.rhinode.dispatch.Logging);

var Console = function() {

  this.log = function(msg) {
    Logging.info(msg);
  }

  this.info = function(msg) {
    this.log(msg);
  }

  this.warn = function(msg) {
    Logging.warn(msg);
  }

  this.error = function(msg) {
    Logging.error(msg);
  }

}

var console = new Console();

