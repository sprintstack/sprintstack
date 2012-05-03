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
  }

  this.emit = function(event) {
    var event = new Event(event);
    actor.tell(event);
  }

}

var evt = new EventEmitter();
evt.on('foo', function() {
  console.log("inside event!");
});

evt.on('bar', function() {
  console.log("bar event");
})
evt.emit('foo');
evt.emit('bar');
evt.emit('bar');
java.lang.Thread.sleep(100);

