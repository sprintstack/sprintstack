importClass(java.net.InetSocketAddress);
importClass(java.util.concurrent.ConcurrentHashMap);
importClass(java.util.concurrent.Executors);
importClass(java.util.concurrent.atomic.AtomicBoolean);
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
importClass(Packages.org.jboss.netty.handler.ssl.SslHandler);

var ks = require('keystore');
var match = require('match');

var Pipeline = function(connectionListener, options) {
  return new JavaAdapter(ChannelPipelineFactory, {getPipeline: function() {
    var pipeline = Channels.pipeline();

    if (options['context'] != null) {
      var engine = options['context'].createSSLEngine();
      engine.setUseClientMode(false);
      pipeline.addLast("ssl", new SslHandler(engine));
    }

    var Handler = ServerHandler;
    if (options['handler'] != null) Handler = options['handler'];

    pipeline.addLast("decoder", new HttpRequestDecoder());
    pipeline.addLast("aggregator", new HttpChunkAggregator(65536));
    pipeline.addLast("encoder", new HttpResponseEncoder());
    pipeline.addLast("handler", Handler(connectionListener));
    return pipeline;
  }});
}


var status = {200: HttpResponseStatus.OK};


var EmptyServerRequest = function(observers) {

  this.emit = function() {
    var args = Array.prototype.slice.call(arguments);
    var msg = args.splice(0,1);
    var fns = observers.filter(function(e) {
      return e[0] == msg;
    }).forEach(function(f) {
      f[1].apply(null, args);
    });
  }

}


var ServerRequest = function(ctx, e, observers) {

  this.on = function(msg, fn) {
    observers.push([msg, fn]);
  }

  this.emit = function() {
    var args = Array.prototype.slice.call(arguments);
    var msg = args.splice(0,1);
    var fns = observers.filter(function(e) {
      return e[0] == msg;
    }).forEach(function(f) {
      f[1].apply(null, args);
    });
  }

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


var ServerResponse = function(ctx, e) {

  this.headers = {};

  this.statusCode = 0;

  this.setHeader = function(name, value) {
    this.headers[name] = value;
  }

  this.getHeader = function(name) {
    return this.headers[name];
  }

  this.removeHeader = function(name) {
    delete this.headers[name];
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
    this.write(msg, function(f) {
      f.getChannel().close();
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
    fired: new AtomicBoolean(false),
    listeners: [],
    channelConnected: function(ctx, e) {

    },
    messageReceived: function(ctx, e) {
      req = new ServerRequest(ctx, e, this.listeners);
      this.res = new ServerResponse(ctx, e);
      if (!this.fired.getAndSet(true)) connectionListener(req, this.res);
      req.emit('data', e.getMessage().getContent());
    },
    channelClosed: function(ctx, e) {
      req = new EmptyServerRequest(this.listeners);
      req.emit('end');
    },
    exceptionCaught: function(ctx, e) {
      console.log(e);
      e.getChannel().close();
    }
  });
};


var Server = function() {
  if (arguments[0].constructor === Function) {
    var connectionListener = arguments[0];
  } else {
    var options = arguments[0];
    if (options['keystore'] != null) var context = ks.setup(options['keystore']);
    if (options['handler'] != null) var handler = options['handler'];
    var connectionListener = arguments[1];
  }

  Dispatch.setAwait();

  var internalAddress = null;

  this.listen = function() {
    var port, host, cb;

    var args = match(
      [[Number], function(p) {
        port = p;
      }],
      [[Number, String], function(p, h) {
        [port, host] = [p, h];
      }],
      [[Number, Function], function(p, c) {
        [port, cb] = [p, c];
      }],
      [[Number, String, Function], function(p, h, c) {
        [port, host, cb] = [p, h, c]
      }]
    );

    if (!host) host = "0.0.0.0";
    if (!cb) cb = function() {};

    args.call(this, Array.prototype.slice.call(arguments))

    new future(function() {
      var internalAddress = new InetSocketAddress(host, port);
      var factory = new NioServerSocketChannelFactory(Executors.newSingleThreadExecutor(),
                                                      Executors.newCachedThreadPool(), 1);
      var bootstrap = new ServerBootstrap(factory);

      bootstrap.setPipelineFactory(Pipeline(connectionListener, {'context':context, 'handler':handler}));
      bootstrap.bind(internalAddress);
    }).effect(cb).recover(function(e) {
      java.lang.System.out.println(e)
    });
  };

}

exports.createServer = function(options, fn) {
  return new Server(options, fn);
};

exports.Server = Server;
exports.Pipeline = Pipeline;
exports.ServerRequest = ServerRequest;
exports.ServerResponse = ServerResponse;

