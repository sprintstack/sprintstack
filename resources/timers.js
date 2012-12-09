/*importClass(Packages.akka.util.Duration);
importClass(com.sprintstack.dispatch.Dispatch);
importClass(java.lang.Runnable);
importClass(java.util.concurrent.TimeUnit);

function scheduleWork(cb, delay) {
  var d = Duration.create(delay, TimeUnit.MILLISECONDS);
  var work = new Runnable({run: cb});
  var worker = new actor(function(msg) {
    msg.run();
  }).actor;
  return [d, worker, work];
};

function getScheduler() {
  return Dispatch.getSystem().scheduler();
}

var Timers = function() {

  this.setTimeout = function(callback, delay) {
    [d, worker, work] = scheduleWork(callback, delay);
    return getScheduler().scheduleOnce(d, worker, work);
  }

  this.clearTimeout = function(timeoutId) {
    timeoutId.cancel();
  }

  this.setInterval = function(callback, delay) {
    [d, worker, work] = scheduleWork(callback, delay);
    return getScheduler().schedule(Duration.Zero(),
                                   d, worker, work);
  }

  this.clearInterval = function(intervalId) {
    intervalId.cancel();
  }

}*/

importClass(java.util.concurrent.TimeUnit);

var Timers = function() {

  var timer = com.sprintstack.Environment.getSystemTimer();

  this.setTimeout = function(callback, delay) {
    return timer.newTimeout(callback, delay, TimeUnit.MILLISECONDS);
  }

  this.clearTimeout = function(timeout) {
    timeout.cancel();
  }

  this.setInterval = function(callback, delay) {
    
  }

  this.clearInterval = function(intervalId) {
  }

};

module.exports = new Timers();
