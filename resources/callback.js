importPackage(com.mowforth.rhinode.dispatch);
importClass(java.util.concurrent.Callable);

var async = function(work, callback) {
  var task = new Callable({call: work});
  var cb = new JavaAdapter(Completion, {onComplete: callback});
  Dispatch.future(task, cb);
 };

