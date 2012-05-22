importClass(Packages.akka.actor.Actors);
importClass(Packages.akka.actor.UntypedActorFactory);
importClass(Packages.akka.actor.UntypedActor);
importClass(Packages.akka.actor.Props);
importClass(Packages.akka.routing.RoundRobinRouter);
importClass(com.sprintstack.dispatch.Dispatch);

var actorFactory = function(handler) {
  return new JavaAdapter(UntypedActorFactory, {create: function() {
    return new JavaAdapter(UntypedActor, handler);
  }});
};

var actor = function(fn,options) {
  var base = {
    preStart: function() {
      this.handlers = [fn];
      this.handler = fn;
      if (options && options.prestart) options.prestart.call(this);
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
    },
    postStop: function() {
      if (options && options.shutdown) options.shutdown.call(this);
    }
  };

  var af = actorFactory(base);
  if (options && options["n"]) {
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

