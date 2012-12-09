importClass(java.util.concurrent.atomic.AtomicReference)
importClass(java.util.concurrent.FutureTask);

dispatcher = com.sprintstack.Environment.getDefaultDispatcher();

factory = function(fn) {
  return new JavaAdapter(FutureTask,
                    {
                      setCallback: function(f) {
                        this.callback.set(f);
                        if (this.isDone()) this.done();
                      },
                      callback: new AtomicReference(),
                      done: function() {
                        if (this.callback.get())
                          dispatcher.execute(this.callback.get());
                    }}, fn);
}

var future = function(f) {

  var self = this;

  if (f.constructor === Function) {
    this.task = factory(f);
    this.lazy = false;
  } else {
    this.task = f;
    this.lazy = true;
  }

  this.then = function(fn) {
    var work = factory(function() {
      return fn(self.await());
    });
    this.task.setCallback(work);

    return new future(work);
  }

  this.await = function() {
    return this.task.get();
  }

  this.done = function() {
    return this.task.isDone();
  }

  if (!this.lazy) dispatcher.execute(this.task);
}

future.compose = function() {
  var args = Array.prototype.slice.call(arguments);
  if (arguments[0].constructor === Array) args = arguments[0];

  return new future(function() {
    var composed = args.map(function(t) {
      return t.await();
    });
    return composed;
  });
}

module.exports = future;

