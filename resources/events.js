var EventEmitter = function() {

  this.on = function(event, listener) {
    var work = new JavaAdapter(IFunction, {apply: listener});

    var e = new EventHandler(event, work);
    actor.tell(e);
  };

  this.emit = function() {
    var args = Array.prototype.slice.call(arguments);
    var event = new Event(args.shift(), args.shift());
    actor.tell(event);
  };

  this.stop = function() {
    actor.tell(Actors.poisonPill());
  };

};

exports.EventEmitter = EventEmitter;

