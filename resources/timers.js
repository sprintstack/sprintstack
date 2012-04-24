importClass(com.mowforth.rhinode.dispatch.Dispatch);
importClass(java.lang.Runnable);

var Timers = function() {

  this.setTimeout = function(callback, delay) {
    var work = new Runnable({run: callback});
    return Dispatch.doOnce(work, delay);
  }

  this.clearTimeout = function(timeoutId) {
    timeoutId.cancel();
  }

  this.setInterval = function(callback, delay) {
    var work = new Runnable({run: callback});
    return Dispatch.doRegularly(work, delay);
  }

  this.clearInterval = function(intervalId) {
    intervalId.cancel();
  }

}

module.exports = new Timers();
