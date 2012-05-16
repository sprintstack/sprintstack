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
}

var actor = function(handler) {
  /*var base = {
    spawn: function(fn) {
      var af = actorFactory(fn);
      return this.getContext().actorOf(new Props().withCreator(af));
    }
  };
  merge(handler, base);*/

  var af = actorFactory(handler);
  if (arguments.length == 2) {
    var options = arguments[1];
    actor = Dispatch.getSystem().actorOf(new Props().withCreator(af).withRouter(new RoundRobinRouter(options["n"])));
  } else {
    actor = Dispatch.getSystem().actorOf(new Props().withCreator(af));
  }
  
  return actor;
};

module.exports = actor;
