importClass(com.mowforth.rhinode.dispatch.Dispatch);
importClass(com.mowforth.rhinode.dispatch.IFunction);
importClass(Packages.akka.dispatch.Await);
importClass(Packages.akka.dispatch.Filter);
importClass(Packages.akka.dispatch.Futures);
importClass(Packages.akka.dispatch.Mapper);
importClass(Packages.akka.dispatch.OnComplete);
importClass(Packages.akka.dispatch.Recover);
importClass(Packages.akka.util.Duration);
importClass(java.util.concurrent.Callable);

var createFuture = function(work, cb) {
  var c = new JavaAdapter(Callable, {call: work});
  var future = Futures.future(c, Dispatch.getSystem().dispatcher());
  return future;
}

var future = function(f) {
  if (f.constructor === Function) {
    this.future = createFuture(f);
  } else {
    this.future = f
  }

  this.effect = function(fn) {
    var callback = new JavaAdapter(OnComplete, {onComplete: fn});
    var effector = this.future.andThen(callback);
    return new future(effector);
  }

  this.then = function(fn) {
    var work = new JavaAdapter(Mapper, {apply: function(val) {
      return createFuture(function() {
        return fn(val);
      });
    }});
    var mapped = this.future.flatMap(work);
    return new future(mapped);
  }

  this.check = function(fn) {
    var predicate = new JavaAdapter(IFunction, {apply: function(val) {
      return fn(val);
    }});

    var filtered = this.future.filter(Filter.filterOf(predicate));
    return new future(filtered);
  }

  this.recover = function(fn) {
    var recovery = new JavaAdapter(Recover, {recover: function(err) {
      return fn(err);
    }});

    var recoverable = this.future.recoverWith(recovery);
    return new future(recoverable);
  }

  this.wait = function() {
    try {
      return Await.result(this.future, Duration.Inf());
    } catch (e) {
      if (e.toString().match("scala.MatchError") != null) {
        return null;
      }
    }
    return Await.result(this.future, Duration.Inf());
  }

  return this;
};

future.compose = function() {
  var args = Array.prototype.slice.call(arguments);
  if (arguments[0].constructor === Array) args = arguments[0];

  var futures = args.map(function(f) {
    return f.future;
  });

  var composed = Futures.sequence(futures, Dispatch.getSystem().dispatcher());
  return new future(composed);
}

module.exports = future;

