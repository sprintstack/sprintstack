importClass(com.mowforth.rhinode.dispatch.Dispatch);
importClass(Packages.akka.dispatch.OnComplete);
importClass(java.util.concurrent.Callable);

var async = function() {
  var args = Array.prototype.slice.call(arguments);

  var task = new Callable({call: args.shift()});

  if (args.length > 0) {
    var cb = new JavaAdapter(OnComplete, {onComplete: args.shift()});
    return Dispatch.future(task).andThen(cb);
  } else {
    return Dispatch.future(task);
  }
};

