importClass(Packages.akka.actor.Actors);
importClass(Packages.akka.actor.UntypedActorFactory);
importClass(Packages.akka.actor.UntypedActor);
importClass(Packages.akka.actor.Props);
importClass(Packages.akka.routing.RoundRobinRouter);
importClass(com.mowforth.rhinode.dispatch.Dispatch);

var actorFactory = function(handler) {
  return new JavaAdapter(UntypedActorFactory, {create: function() {
    return new JavaAdapter(UntypedActor, handler);
  }});
};

function merge(obj1, obj2) {
  for (attr in obj2) obj1[attr] = obj2[attr];
};

var actor = function(fn) {
  var base = {
    preStart: function() {
      this.handlers = [fn];
      this.handler = fn;
    },
    reply: function(msg) {
      this.getSender().tell(msg);
    },
    onReceive: function(msg) {
      if (msg.constructor === Array) {
        switch (msg[0]) {
          case "upgrade":
          this.handlers.push(msg[1]);
          break;
          case "downgrade":
          if (this.handlers.length > 1) {
            this.handlers.pop();
          }
          break;
        }
      } else {
        h = this.handlers[this.handlers.length-1];
        h.call(this, msg);
      }
    }
  };

  var af = actorFactory(base);
  if (arguments.length == 2) {
    var options = arguments[1];
    actor = Dispatch.getSystem().actorOf(new Props().withCreator(af).withRouter(new RoundRobinRouter(options["n"])));
  } else {
    actor = Dispatch.getSystem().actorOf(new Props().withCreator(af));
  }

  this.actor = actor;

  this.send = function(msg) {
    this.actor.tell(msg);
  }

  this.upgrade = function(fn) {
    this.send(['upgrade', fn]);
  }

  this.downgrade = function() {
    this.send(['downgrade']);
  }};


module.exports = actor;

