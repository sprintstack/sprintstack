importClass(java.net.InetSocketAddress);
importClass(java.util.concurrent.CopyOnWriteArraySet);
importClass(java.util.concurrent.Executor);
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
var util = require('util');

var Pipeline = function(connectionListener) {
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


Exec = function() {
  return new Executor({
  execute: function(fn) {
    new future(function() {
      fn.run();
    })
  }});
};


var socket = function(ctx, e, handlers) {
  this.write = function(msg, cb) {
    var f = e.getChannel().write(msg);
    if (cb == null) return f;
    f.addListener(
      new JavaAdapter(ChannelFutureListener, {
        operationComplete: cb
      }));
  }

  this.end = function(msg) {
    if (msg == null) e.getChannel.close();
    else
    this.write(msg, function(future) {
      future.getChannel().close();
    });
  }

  this.address = function() {
    var addr = e.getChannel().getRemoteAddress();
    return {"address" : addr.getAddress().toString(),
           "port" : addr.getPort()};
  }

  this.on = function(e, fn) {
    handlers.add([e, fn]);
  }

  this.emit = function(e) {
    
  }

};


var ServerHandler = function(connectionListener) {
  return new JavaAdapter(SimpleChannelUpstreamHandler, {
    handlers: new CopyOnWriteArraySet(),
    channelOpen: function(ctx, e) {
    },
    channelConnected: function(ctx, e) {
    },
    channelDisconnected: function(ctx, e) {
    },
    channelClosed: function(ctx, e) {
    },
    messageReceived: function(ctx, e) {
      var s = new socket(ctx, e, this.handlers);
      connectionListener(s);
    },
    exceptionCaught: function(ctx, e) {
    }
  });
};

var Server = function(connectionListener) {

  var internalAddress = null;

  this.listen = function(port, cb) {
    new future(function() {
      internalAddress = new InetSocketAddress(port);
      var factory = new NioServerSocketChannelFactory(Executors.newSingleThreadExecutor(),
                                                      Exec());
      var bootstrap = new ServerBootstrap(factory);

      bootstrap.setPipelineFactory(Pipeline(connectionListener));
      bootstrap.bind(internalAddress);
    }).recover(function(e) {
      java.lang.System.println(e)
    });
  };

  this.address = function() {
    return {"address" : internalAddress.getHostName(),
            "port" : internalAddress.getPort()};
  };

}

exports.createServer = function(listener) {
  return new Server(listener);
};

