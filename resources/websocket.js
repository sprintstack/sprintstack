importClass(Packages.org.jboss.netty.buffer.ChannelBuffers);
importClass(Packages.org.jboss.netty.channel.Channels);
importClass(Packages.org.jboss.netty.channel.ChannelFutureListener);
importClass(Packages.org.jboss.netty.channel.MessageEvent);
importClass(Packages.org.jboss.netty.channel.SimpleChannelUpstreamHandler);
importClass(Packages.org.jboss.netty.handler.codec.http.HttpMethod);
importClass(Packages.org.jboss.netty.handler.codec.http.HttpHeaders);
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

var http = require('http');
var match = require('match');
var util = require('util');

var WsRequest = http.ServerRequest;
var WsResponse = http.ServerResponse;

var WebSocketHandler = function(connectionListener) {
  return new JavaAdapter(SimpleChannelUpstreamHandler, {
    fired: new AtomicBoolean(false),
    observers: [],
    messageReceived: function(ctx, e) {
      var msg = e.getMessage();
      if (msg instanceof HttpRequest) {
        this.handleHttp(ctx, msg);
      } else if (msg instanceof WebSocketFrame) {
        this.handleWs(ctx, msg);
      }
    },
    channelClosed: function(ctx, msg) {
      req.emit('end');
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
      if (frame instanceof CloseWebSocketFrame) {
        this.handshaker.close(ctx.getChannel(), frame);
      return;
      } else if (frame instanceof PingWebSocketFrame) {
        ctx.getChannel.write(new PongWebsocketFrame(frame.getBinaryData()))
        return;
      } else if (frame instanceof TextWebSocketFrame) {
        msg = frame.getText();
        ctx.getChannel().write(new TextWebSocketFrame(msg));
      }
    },
    getWebSocketLocation: function(msg) {
      return "ws://" + msg.getHeader(HttpHeaders.Names.HOST) + "/ws";
    },
    exceptionCaught: function(ctx, e) {
      e.getChannel().close();
    }
  });
};

var Server = http.Server;

exports.createServer = function(options, listener) {
  var opt, fn;
  var args = match(
    [[Function], function(f) {
      [opt, fn] = [{}, f];
    }],
    [[Object, Function], function(o, f) {
      [opt, fn] = [o, f];
    }]
  );

  args.call(this, Array.prototype.slice.call(arguments));
  util.merge(opt, {'handler': WebSocketHandler});

  return new Server(opt, fn);
};

