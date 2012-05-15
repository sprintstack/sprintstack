importClass(java.net.InetSocketAddress);
importClass(java.util.concurrent.Executors);
importClass(Packages.org.jboss.netty.bootstrap.ServerBootstrap);
importClass(Packages.org.jboss.netty.channel.socket.nio.NioServerSocketChannelFactory);
importClass(Packages.org.jboss.netty.channel.ChannelFutureListener);
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


var wibble = new JavaAdapter(SimpleChannelUpstreamHandler, {
  channelConnected: function(ctx, e) {
    console.log('bumeyes!');
    ctx.sendUpstream(e);
  }
});

var Pipeline = function(connectionListener) {
  return new JavaAdapter(ChannelPipelineFactory, {getPipeline: function() {
    var pipeline = Channels.pipeline();

    pipeline.addLast("framer", new DelimiterBasedFrameDecoder(8192,
                                                              Delimiters.lineDelimiter()));
    pipeline.addLast("decoder", new StringDecoder());
    pipeline.addLast("encoder", new StringEncoder());
    pipeline.addLast("bumeyes", wibble);
    pipeline.addLast("handler", ServerHandler(connectionListener));
    return pipeline;
  }});
};


function ConnectionHandler() {

  this.channel = null;

  events.EventEmitter.call(this);

  this.write = function() {
    var f = this.channel.write(arguments[0]);
    if (arguments.length == 2) {
      var listener = new JavaAdapter(ChannelFutureListener, {
        operationComplete: arguments[1]
      });
      f.addListener(listener);
    }
  };

  this.pipe = function(recipient) {
    this.on('data', function(e) {
      recipient.write(e.getMessage());
    });
  };

};


util.inherits(ConnectionHandler, events.EventEmitter);


var ServerHandler = function(connectionListener) {
  return new JavaAdapter(SimpleChannelUpstreamHandler, {
    actor: new ConnectionHandler(),
    channelOpen: function(ctx, e) {
      this.actor.channel = e.getChannel();
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
    new future(function() {
      internalAddress = new InetSocketAddress(port);
      var factory = new NioServerSocketChannelFactory(Executors.newSingleThreadExecutor(),
                                                      Executors.newCachedThreadPool(),
                                                     1);
      var bootstrap = new ServerBootstrap(factory);

      bootstrap.setPipelineFactory(Pipeline(connectionListener));
      bootstrap.bind(internalAddress);
    }, cb);
  };

  this.address = function() {
    return {"address" : internalAddress.getHostName(),
            "port" : internalAddress.getPort()};
  };

}

exports.createServer = function(listener) {
  return new Server(listener);
};

