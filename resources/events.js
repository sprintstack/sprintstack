importClass(com.mowforth.rhinode.dispatch.Dispatch);
importClass(com.mowforth.rhinode.dispatch.Event);
importClass(com.mowforth.rhinode.dispatch.EventHandler);
importClass(com.mowforth.rhinode.dispatch.IFunction);

var EventEmitter = function() {

  var actor = Dispatch.newEventHandler();

  this.on = function(event, listener) {
    var work = new JavaAdapter(IFunction, {apply: listener});

    var e = new EventHandler(event, work);
    actor.tell(e);
    return e;
  }

  this.emit = function() {
    var args = Array.prototype.slice.call(arguments);
    var event = new Event(args.shift(), args.shift());
    actor.tell(event);
  }

}

exports.EventEmitter = EventEmitter;

