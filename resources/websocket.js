importClass(java.net.InetSocketAddress);
importClass(java.util.concurrent.Executors);
importClass(Packages.org.jboss.netty.bootstrap.ServerBootstrap);
importClass(Packages.org.jboss.netty.buffer.ChannelBuffers);
importClass(Packages.org.jboss.netty.channel.Channels);
importClass(Packages.org.jboss.netty.channel.ChannelFutureListener);
importClass(Packages.org.jboss.netty.channel.ChannelPipelineFactory);
importClass(Packages.org.jboss.netty.channel.MessageEvent);
importClass(Packages.org.jboss.netty.channel.SimpleChannelUpstreamHandler);
importClass(Packages.org.jboss.netty.channel.socket.nio.NioServerSocketChannelFactory);
importClass(Packages.org.jboss.netty.handler.codec.http.HttpChunkAggregator);
importClass(Packages.org.jboss.netty.handler.codec.http.HttpRequestDecoder);
importClass(Packages.org.jboss.netty.handler.codec.http.HttpResponseEncoder);
importClass(Packages.org.jboss.netty.handler.codec.http.HttpMethod);
importClass(Packages.org.jboss.netty.handler.codec.http.HttpHeaders);
importClass(Packages.org.jboss.netty.handler.codec.http.HttpHeaders.Names);
importClass(Packages.org.jboss.netty.handler.codec.http.HttpResponseStatus);
importClass(Packages.org.jboss.netty.handler.codec.http.HttpVersion);
importClass(Packages.org.jboss.netty.handler.codec.http.HttpRequest)
importClass(Packages.org.jboss.netty.handler.codec.http.DefaultHttpResponse);
importClass(Packages.org.jboss.netty.handler.codec.http.websocketx.WebSocketFrame);
importClass(Packages.org.jboss.netty.handler.codec.http.websocketx.CloseWebSocketFrame);
importClass(Packages.org.jboss.netty.handler.codec.http.websocketx.PingWebSocketFrame);
importClass(Packages.org.jboss.netty.handler.codec.http.websocketx.PongWebSocketFrame);
importClass(Packages.org.jboss.netty.handler.codec.http.websocketx.TextWebSocketFrame);
importClass(Packages.org.jboss.netty.handler.codec.http.websocketx.WebSocketServerHandshaker);
importClass(Packages.org.jboss.netty.handler.codec.http.websocketx.WebSocketServerHandshakerFactory);


var Pipeline = function(connectionListener) {
  return new JavaAdapter(ChannelPipelineFactory, {getPipeline: function() {
    var pipeline = Channels.pipeline();

    pipeline.addLast("decoder", new HttpRequestDecoder());
    pipeline.addLast("aggregator", new HttpChunkAggregator(65536));
    pipeline.addLast("encoder", new HttpResponseEncoder());
    pipeline.addLast("handler", ServerHandler(connectionListener));
    return pipeline;
  }});
}

var worker = {
  onReceive: function(msg) {
    this.getSender().tell(['res', "Hello, world!"]);
  }
};

var boss = {
  onReceive: function(msg) {
    if (msg[0] == 'data') {
      this.channel = msg[2].getChannel();
      slave.tell(['data', msg[2].getMessage()], this.getSelf());
    } else if (msg[0] == 'err') {
      console.log(msg[2]);
    } else if (msg[0] == 'res') {
      this.handleHttp(msg[1]);
    }
  },
  handleHttp: function(msg) {
    res = new DefaultHttpResponse(HttpVersion.HTTP_1_1, HttpResponseStatus.OK);
    res.setContent(ChannelBuffers.copiedBuffer("Hello, world!\n", "UTF-8"));
    this.channel.write(res).addListener(new JavaAdapter(ChannelFutureListener, {operationComplete: function(f) {
      f.getChannel().close();
    }}));
/*
      wsfactory = new WebSocketServerHandshakerFactory(this.getWebSocketLocation(msg), null, false);
      this.handshaker = wsfactory.newHandshaker(msg);
      if (this.handshaker == null) {
        wsFactory.sendUnsupportedWebSocketVersionResponse(ctx.getChannel());
      } else {
        this.handshaker.handshake(ctx.getChannel(), msg).addListener(WebSocketServerHandshaker.HANDSHAKE_LISTENER);
      }*/
    },
  handleWs: function(ctx, frame) {
    console.log('ws');
    if (frame instanceof CloseWebSocketFrame) {
      this.handshaker.close(ctx.getChannel(), frame);
      return;
    } else if (frame instanceof PingWebSocketFrame) {
      ctx.getChannel.write(new PongWebsocketFrame(frame.getBinaryData()))
      return;
    } else if (frame instanceof TextWebSocketFrame) {
      req = frame.getText();
      ctx.getChannel().write(new TextWebSocketFrame("bumeyes"));
    }
  },
  getWebSocketLocation: function(msg) {
    return "ws://" + msg.getHeader(HttpHeaders.Names.HOST) + "/ws";
  }
};

var slave = new actor(worker, {"n":5});

var ServerHandler = function(connectionListener) {
  return new JavaAdapter(SimpleChannelUpstreamHandler, {
    supervisor: new actor(boss),
    channelOpen: function(ctx, e) {
      this.supervisor.tell(['open', ctx, e]);
    },
    messageReceived: function(ctx, e) {
      this.supervisor.tell(['data', ctx, e]);
    },
    exceptionCaught: function(ctx, e) {
      this.supervisor.tell(['err', ctx, e]);
    }
  });
};

var Server = function(connectionListener) {

  var internalAddress = null;

  this.listen = function(port, cb) {
    new future(function() {
      internalAddress = new InetSocketAddress(port);
      var factory = new NioServerSocketChannelFactory(Executors.newSingleThreadExecutor(),
                                                      Executors.newCachedThreadPool(), 1);
      var bootstrap = new ServerBootstrap(factory);

      bootstrap.setPipelineFactory(Pipeline(connectionListener));
      bootstrap.bind(internalAddress);
    }, cb).recover(function(e) {
      java.lang.System.out.println(e)
    });
  };

}

exports.createServer = function(listener) {
  return new Server(listener);
};
