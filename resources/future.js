importClass(java.util.concurrent.atomic.AtomicReference)
importClass(java.util.concurrent.CountDownLatch)
importClass(Packages.org.fusesource.hawtdispatch.Dispatch)

var future = function(fn, auto) {

  var self = this;

  this.val = new AtomicReference();
  this.callback = new AtomicReference();
  this.latch = new CountDownLatch(1);

  this.then = function(fn) {
    var f = new future(fn, false);
    this.callback.set(f);
    // If current future has finished already,
    // invoke the next one right away.
    if (this.isComplete()) f.start(this.val.get());
    return f;
  }

  this.await = function() {
    this.latch.await();
    return this.val.get();
  }

  this.work = function(v) {
    var val = fn(v);
    self.val.set(val);
    self.latch.countDown();
    var cb = self.callback.get();
    if (cb != null && !cb.isComplete())
      cb.start(val);
  }

  this.start = function(v) {
    Dispatch.getGlobalQueue().execute(function() { self.work(v) });
  }

  this.isComplete = function() {
    return (this.latch.getCount() == 0)
  }

  if (!auto) this.start();
}

future.compose = function() {
  var args = Array.prototype.slice.call(arguments);
  if (arguments[0].constructor === Array) args = arguments[0];

  var f = new future(function(v) {
    return args.map(function(f) {
      return f.await();
    });
  }, false);

  return f;
}

module.exports = future;

