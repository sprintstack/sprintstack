importClass(java.net.InetSocketAddress);
importClass(java.util.concurrent.ConcurrentHashMap);
importClass(java.util.concurrent.Executors);
importClass(com.sprintstack.dispatch.Dispatch);
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
importClass(Packages.org.jboss.netty.handler.codec.http.HttpRequest);
importClass(Packages.org.jboss.netty.handler.codec.http.DefaultHttpResponse);


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


var status = {200: HttpResponseStatus.OK};


var Request = function(ctx, e) {

  this.url = e.getMessage().getUri();

  this.method = e.getMessage().getMethod();

  function buildHeaders() {
    var headers = {};
    var keys = e.getMessage().getHeaderNames().iterator();
    while (keys.hasNext()) {
      var k = keys.next();
      headers[k] = e.getMessage().getHeader(k);
    }
    return headers;
  }

  this.headers = buildHeaders();

  function getVersion() {
    switch (e.getMessage().getProtocolVersion()) {
    case HttpVersion.HTTP_1_0: return "1.0";
    case HttpVersion.HTTP_1_1: return "1.1";
    }
  }

  this.httpVersion = getVersion();

  this.setEncoding = function(encoding) {
    if (encoding != null) {
      
    }
  }

}


var Response = function(ctx, e) {

  this.headers = {};

  this.statusCode = 0;

  this.setHeader = function(name, value) {
    this.headers.name = value;
  }

  this.getHeader = function(name) {
    return this.headers.name;
  }

  this.removeHeader = function(name) {
    this.headers.name = null;
  }

  this.writeHead = function(code, headers) {
    this.statusCode = code;
    this.headers = headers;
  }

  this.write = function(msg, cb) {
    this.response = new DefaultHttpResponse(HttpVersion.HTTP_1_1, status[this.statusCode]);
    this.response.setContent(ChannelBuffers.copiedBuffer(msg, "UTF-8"));
    for (var key in this.headers) this.response.setHeader(key, this.headers[key]);
    var f = e.getChannel().write(this.response);
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

};


var ServerHandler = function(connectionListener) {
  return new JavaAdapter(SimpleChannelUpstreamHandler, {
    listeners: new ConcurrentHashMap(),
    channelOpen: function(ctx, e) {
      
    },
    messageReceived: function(ctx, e) {
      var req = new Request(ctx, e);
      var res = new Response(ctx, e);
      connectionListener(req, res);
    },
    exceptionCaught: function(ctx, e) {
    }
  });
};


var Server = function(connectionListener) {
  Dispatch.setAwait();

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
