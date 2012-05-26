importClass(javax.jmdns.JmDNS);
importClass(javax.jmdns.ServiceInfo);
importClass(javax.jmdns.ServiceTypeListener);
importClass(Packages.akka.dispatch.Terminate);

function parseEvent(e) {
  var info = e.getInfo();
  var addr = info.getAddresses();
  var addresses = [];
  for (var a in addr) addresses.push(a);
  var description = new java.lang.String(info.getTextBytes()).toString();
  return {
    'name': info.getName(),
    'host': addresses,
    'port': info.getPort(),
    'type': info.getType(),
    'description': description
  };
};

var MDNSService = function(responder, service) {

  this.close = function() {
    responder.send({kill: service});
  }

}

var MDNSListener = function(responder, listener) {

  this.stop = function() {
    responder.send({kill: listener});
  }

};

var MDNS = function() {

  var responder = new actor(function(msg) {
    if (msg instanceof ServiceInfo) {
      this.responder.registerService(msg);
    } else if (msg instanceof ServiceTypeListener) {
      this.responder.addServiceTypeListener(msg);
    } else if (msg instanceof Terminate) {
      this.responder.unregisterAllServices();
    }
    else {
      if (msg.kill instanceof ServiceInfo) this.responder.unregisterService(msg.kill);
      if (msg.kill instanceof ServiceListener) this.responder.removeServiceListener(msg.kill);
    }
  }, {prestart: function() {
    this.responder = JmDNS.create();
  }, shutdown: function() {
    this.responder.unregisterAllServices();
  }});

  this.announce = function(type, name, port, description) {
    var info = ServiceInfo.create(type, name, port, description);
    responder.send(info);
    return new MDNSService(responder, info);
  }
  this.listen = function(type, add, remove) {
    var listener = new ServiceListener({
      serviceResolved: function(e) {
        add(parseEvent(e));
      },
      serviceRemoved: function(e) {
        remove(parseEvent(e));
      }
    });
    responder.send(listener);

    return new MDNSListener(responder, listener);
  }

};

module.exports = new MDNS();

