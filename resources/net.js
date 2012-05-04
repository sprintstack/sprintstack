importClass(java.net.InetSocketAddress);
importClass(java.util.concurrent.Executors);
importClass(Packages.org.jboss.netty.bootstrap.ServerBootstrap);
importClass(Packages.org.jboss.netty.channel.socket.nio.NioServerSocketChannelFactory);
importClass(Packages.org.jboss.netty.channel.ChannelPipelineFactory);
importClass(Packages.org.jboss.netty.handler.codec.frame.DelimiterBasedFrameDecoder);
importClass(Packages.org.jboss.netty.handler.codec.frame.Delimiters);
importClass(Packages.org.jboss.netty.handler.codec.string.StringDecoder);
importClass(Packages.org.jboss.netty.handler.codec.string.StringEncoder);
importClass(Packages.org.jboss.netty.channel.Channels);
importClass(Packages.org.jboss.netty.channel.SimpleChannelUpstreamHandler);

var console = require('console');
var events = require('events');
var util = require('util');


Pipeline = function(connectionListener) {
  return new JavaAdapter(ChannelPipelineFactory, {getPipeline: function() {
    var pipeline = Channels.pipeline();

    pipeline.addLast("framer", new DelimiterBasedFrameDecoder(8192,
                                                              Delimiters.lineDelimiter()));
    pipeline.addLast("decoder", new StringDecoder());
    pipeline.addLast("encoder", new StringEncoder());
    pipeline.addLast("handler", ServerHandler(connectionListener));
    return pipeline;
  }});
};


function ConnectionHandler() {

  this.event = null; // Hack! event is temporal and NOT thread-safe

  events.EventEmitter.call(this);

  this.write = function(msg) {
    this.event.getChannel().write(msg);
  };

  this.pipe = function(recipient) {
    this.on('data', function(e) {
      recipient.event.getChannel().write(e.getMessage());
    });
  };

};


util.inherits(ConnectionHandler, events.EventEmitter);


var ServerHandler = function(connectionListener) {
  return new JavaAdapter(SimpleChannelUpstreamHandler, {
    actor: new ConnectionHandler(),
    channelOpen: function(ctx, e) {
      this.actor.event = e;
      this.actor.on('connect', connectionListener);
    },
    channelConnected: function(ctx, e) {
      this.actor.emit('connect', this.actor);
    },
    channelDisconnected: function(ctx, e) {
      this.actor.emit('end');
    },
    channelClosed: function(ctx, e) {
      this.actor.emit('close');
      this.actor.stop();
    },
    messageReceived: function(ctx, e) {
      this.actor.emit('data', e);
    },
    exceptionCaught: function(ctx, e) {
      this.actor.emit('error');
    }
  });
};


var Server = function(connectionListener) {

  var internalAddress = null;

  this.listen = function(port, cb) {
    async(function() {
      internalAddress = new InetSocketAddress(port);
      var factory = new NioServerSocketChannelFactory(Executors.newCachedThreadPool(),
                                                      Executors.newCachedThreadPool());
      var bootstrap = new ServerBootstrap(factory);

      bootstrap.setPipelineFactory(Pipeline(connectionListener));
      bootstrap.bind(internalAddress);
    }, cb);
    com.mowforth.rhinode.dispatch.Dispatch.getSystem().awaitTermination();
  };

  this.address = function() {
    return {"address" : internalAddress.getHostName(),
            "port" : internalAddress.getPort()};
  };

}

exports.createServer = function(listener) {
  return new Server(listener);
};

