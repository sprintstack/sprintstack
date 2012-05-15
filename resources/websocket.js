importClass(java.net.InetSocketAddress);
importClass(java.util.concurrent.Executors);
importClass(Packages.org.jboss.netty.bootstrap.ServerBootstrap);
importClass(Packages.org.jboss.netty.channel.Channels);
importClass(Packages.org.jboss.netty.channel.ChannelPipelineFactory);
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
importClass(Packages.org.jboss.netty.handler.codec.http.websocketx.WebSocketFrame);
importClass(Packages.org.jboss.netty.handler.codec.http.websocketx.CloseWebSocketFrame);
importClass(Packages.org.jboss.netty.handler.codec.http.websocketx.PingWebSocketFrame);
importClass(Packages.org.jboss.netty.handler.codec.http.websocketx.PongWebSocketFrame);
importClass(Packages.org.jboss.netty.handler.codec.http.websocketx.TextWebSocketFrame);
importClass(Packages.org.jboss.netty.handler.codec.http.websocketx.WebSocketServerHandshaker);
importClass(Packages.org.jboss.netty.handler.codec.http.websocketx.WebSocketServerHandshakerFactory);

var console = require('console');

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


var ServerHandler = function(connectionListener) {
  return new JavaAdapter(SimpleChannelUpstreamHandler, {
    getWebSocketLocation: function(msg) {
      return "ws://" + msg.getHeader(HttpHeaders.Names.HOST) + "/ws";
    },
    handleHttp: function(ctx, msg) {
      wsfactory = new WebSocketServerHandshakerFactory(this.getWebSocketLocation(msg), null, false);
      this.handshaker = wsfactory.newHandshaker(msg);
      if (this.handshaker == null) {
        wsFactory.sendUnsupportedWebSocketVersionResponse(ctx.getChannel());
      } else {
        this.handshaker.handshake(ctx.getChannel(), msg).addListener(WebSocketServerHandshaker.HANDSHAKE_LISTENER);
      }
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
        console.log(req);
        ctx.getChannel().write(new TextWebSocketFrame("bumeyes"));
      }
    },
    messageReceived: function(ctx, e) {
      var msg = e.getMessage();
      if (msg instanceof HttpRequest) {
        this.handleHttp(ctx, msg);
      } else if (msg instanceof WebSocketFrame) {
        this.handleWs(ctx, msg);
      }
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
    }, cb).recover(function(e) {
      console.log(e);
    });
  };

}

exports.createServer = function(listener) {
  return new Server(listener);
};
