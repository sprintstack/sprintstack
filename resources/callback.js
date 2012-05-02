importClass(com.mowforth.rhinode.dispatch.Dispatch);
importClass(Packages.akka.dispatch.OnComplete);
importClass(java.util.concurrent.Callable);

var async = function(work, callback) {
  var task = new Callable({call: work});
  var cb = new JavaAdapter(OnComplete, {onComplete: callback});
  Dispatch.future(task, cb);
 };

