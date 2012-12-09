importClass(Packages.org.fusesource.hawtdispatch.Dispatch)

var queue = function() {
  this.internalQueue = Dispatch.createQueue();

  this.push = function(fn) {
    this.internalQueue.execute(fn);
  }
}

module.exports = queue;
