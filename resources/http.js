importClass(java.net.InetSocketAddress);
importClass(java.util.concurrent.ConcurrentHashMap);
importClass(java.util.concurrent.Executors);
importClass(java.util.concurrent.atomic.AtomicBoolean);
importClass(Packages.org.fusesource.hawtdispatch.Dispatch);
importClass(Packages.org.jboss.netty.bootstrap.ServerBootstrap);
importClass(Packages.org.jboss.netty.buffer.ChannelBuffers);
importClass(Packages.org.jboss.netty.channel.Channels);
importClass(Packages.org.jboss.netty.channel.ChannelFutureListener);
importClass(Packages.org.jboss.netty.channel.ChannelPipelineFactory);
importClass(Packages.org.jboss.netty.channel.MessageEvent);
importClass(Packages.org.jboss.netty.channel.SimpleChannelUpstreamHandler);
importClass(Packages.org.jboss.netty.channel.socket.nio.NioServerSocketChannelFactory);
importClass(Packages.org.jboss.netty.handler.codec.http.CookieDecoder);
importClass(Packages.org.jboss.netty.handler.codec.http.CookieEncoder);
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

var events = require('events');
var ks = require('keystore');
var match = require('match');
var util = require('util');

var HTTP_VERSIONS = {
  "HTTP/1.0": "1.0",
  "HTTP/1.1": "1.1"
}

var STATUS_CODES = exports.STATUS_CODES = {
  100 : 'Continue',
  101 : 'Switching Protocols',
  102 : 'Processing',                 // RFC 2518, obsoleted by RFC
  // 4918
  200 : 'OK',
  201 : 'Created',
  202 : 'Accepted',
  203 : 'Non-Authoritative Information',
  204 : 'No Content',
  205 : 'Reset Content',
  206 : 'Partial Content',
  207 : 'Multi-Status',               // RFC 4918
  300 : 'Multiple Choices',
  301 : 'Moved Permanently',
  302 : 'Moved Temporarily',
  303 : 'See Other',
  304 : 'Not Modified',
  305 : 'Use Proxy',
  307 : 'Temporary Redirect',
  400 : 'Bad Request',
  401 : 'Unauthorized',
  402 : 'Payment Required',
  403 : 'Forbidden',
  404 : 'Not Found',
  405 : 'Method Not Allowed',
  406 : 'Not Acceptable',
  407 : 'Proxy Authentication Required',
  408 : 'Request Time-out',
  409 : 'Conflict',
  410 : 'Gone',
  411 : 'Length Required',
  412 : 'Precondition Failed',
  413 : 'Request Entity Too Large',
  414 : 'Request-URI Too Large',
  415 : 'Unsupported Media Type',
  416 : 'Requested Range Not Satisfiable',
  417 : 'Expectation Failed',
  418 : 'I\'m a teapot',              // RFC 2324
  422 : 'Unprocessable Entity',       // RFC 4918
  423 : 'Locked',                     // RFC 4918
  424 : 'Failed Dependency',          // RFC 4918
  425 : 'Unordered Collection',       // RFC 4918
  426 : 'Upgrade Required',           // RFC 2817
  428 : 'Precondition Required',      // RFC 6585
  429 : 'Too Many Requests',          // RFC 6585
  431 : 'Request Header Fields Too Large',// RFC 6585
  500 : 'Internal Server Error',
  501 : 'Not Implemented',
  502 : 'Bad Gateway',
  503 : 'Service Unavailable',
  504 : 'Gateway Time-out',
  505 : 'HTTP Version not supported',
  506 : 'Variant Also Negotiates',    // RFC 2295
  507 : 'Insufficient Storage',       // RFC 4918
  509 : 'Bandwidth Limit Exceeded',
  510 : 'Not Extended',               // RFC 2774
  511 : 'Network Authentication Required' // RFC 6585
};

var NETTY_STATUS_CODES = {
  100: HttpResponseStatus.CONTINUE,
  101: HttpResponseStatus.SWITCHING_PROTOCOLS,
  102: HttpResponseStatus.PROCESSING,
  201: HttpResponseStatus.CREATED,
  200: HttpResponseStatus.OK,
  202: HttpResponseStatus.ACCEPTED,
  203: HttpResponseStatus.NON_AUTHORITATIVE_INFORMATION,
  204: HttpResponseStatus.NO_CONTENT,
  205: HttpResponseStatus.RESET_CONTENT,
  206: HttpResponseStatus.PARTIAL_CONTENT,
  207: HttpResponseStatus.MULTI_STATUS,
  300: HttpResponseStatus.MULTIPLE_CHOICES,
  301: HttpResponseStatus.MOVED_PERMANENTLY,
  302: HttpResponseStatus.FOUND,
  303: HttpResponseStatus.SEE_OTHER,
  304: HttpResponseStatus.NOT_MODIFIED,
  305: HttpResponseStatus.USE_PROXY,
  307: HttpResponseStatus.TEMPORARY_REDIRECT,
  400: HttpResponseStatus.BAD_REQUEST,
  401: HttpResponseStatus.UNAUTHORIZED,
  402: HttpResponseStatus.PAYMENT_REQUIRED,
  403: HttpResponseStatus.FORBIDDEN,
  404: HttpResponseStatus.NOT_FOUND,
  405: HttpResponseStatus.METHOD_NOT_ALLOWED,
  406: HttpResponseStatus.NOT_ACCEPTABLE,
  407: HttpResponseStatus.PROXY_AUTHENTICATION_REQUIRED,
  408: HttpResponseStatus.REQUEST_TIMEOUT,
  410: HttpResponseStatus.GONE,
  411: HttpResponseStatus.LENGTH_REQUIRED,
  412: HttpResponseStatus.PRECONDITION_FAILED,
  413: HttpResponseStatus.REQUEST_ENTITY_TOO_LARGE,
  414: HttpResponseStatus.REQUEST_URI_TOO_LONG,
  415: HttpResponseStatus.UNSUPPORTED_MEDIA_TYPE,
  416: HttpResponseStatus.REQUESTED_RANGE_NOT_SATISFIABLE,
  417: HttpResponseStatus.EXPECTATION_FAILED,
  423: HttpResponseStatus.LOCKED,
  422: HttpResponseStatus.UNPROCESSABLE_ENTITY,
  424: HttpResponseStatus.FAILED_DEPENDENCY,
  425: HttpResponseStatus.UNORDERED_COLLECTION,
  426: HttpResponseStatus.UPGRADE_REQUIRED,
  409: HttpResponseStatus.CONFLICT,  
  500: HttpResponseStatus.INTERNAL_SERVER_ERROR,
  501: HttpResponseStatus.NOT_IMPLEMENTED,
  502: HttpResponseStatus.BAD_GATEWAY,
  503: HttpResponseStatus.SERVICE_UNAVAILABLE,
  504: HttpResponseStatus.GATEWAY_TIMEOUT,
  507: HttpResponseStatus.INSUFFICIENT_STORAGE,
  505: HttpResponseStatus.HTTP_VERSION_NOT_SUPPORTED,
  506: HttpResponseStatus.VARIANT_ALSO_NEGOTIATES,
  510: HttpResponseStatus.NOT_EXTENDED
}


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


var IncomingMessage = function(socket) {
  this.socket = socket;
  this.connection = socket;

  this.httpVersion = null;
  this.complete = false;
  this.headers = {};
  this.trailers = {};

  this.readable = true;

  this._paused = false;
  this._pendings = [];

  this._endEmitted = false;

  // request (server) only
  this.url = '';

  this.method = null;

  // response (client) only
  this.statusCode = null;
  this.client = this.socket;
}


var ServerRequest = function(ctx, e, observers) {

  this.url = e.getMessage().getUri();

  this.method = e.getMessage().getMethod().toString();

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

  this.httpVersion = HTTP_VERSIONS[e.getMessage().getProtocolVersion().toString()];

  this.getCookies = function() {
    var cstr = e.getMessage().getHeader(HttpHeaders.Names.COOKIE);
    var cookies = {};
    if (cstr) {
      if (!this.cookieDecoder) this.cookieDecoder = new CookieDecoder();
      var parsed = this.cookieDecoder.decode(cstr).iterator();
      while (parsed.hasNext()) {
        var cookie = parsed.next();
        cookies[cookie.getName()] = cookie.getValue();
      }
    }
    return cookies;
  }

  this.getCookie = function(name) {
    if (!this.cookies) this.cookies = this.getCookies();
    return this.cookies[name];
  }

}

util.inherits(ServerRequest, events.EventEmitter);

var ServerResponse = function(ctx, e) {

  this.headers = {};
  this._headers = this.headers;

  this.statusCode = 200;

  this.setCookie = function(name, value) {
    if (!this.cookieEncoder) this.cookieEncoder = new CookieEncoder(false);
    this.cookieEncoder.addCookie(name, value);
  }

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
    var response = new DefaultHttpResponse(HttpVersion.HTTP_1_1, NETTY_STATUS_CODES[this.statusCode]);
    response.setContent(ChannelBuffers.copiedBuffer(msg, "UTF-8"));
    if (this.cookieEncoder) response.setHeader(HttpHeaders.Names.SET_COOKIE, this.cookieEncoder.encode());
    for (var key in this.headers) response.setHeader(key, this.headers[key]);
    var writeFuture = e.getChannel().write(response);
    if (cb == null) return writeFuture;
    writeFuture.addListener(
      new JavaAdapter(ChannelFutureListener, {
        operationComplete: cb
      }));
  }

  this.end = function(msg) {
    if (!msg) e.getChannel().close();
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

util.inherits(ServerResponse, events.EventEmitter);

var ServerHandler = function(connectionListener) {
  return new JavaAdapter(SimpleChannelUpstreamHandler, {
    fired: false,
    listeners: [],
    channelConnected: function(ctx, e) {
    },
    messageReceived: function(ctx, e) {
      req = new ServerRequest(ctx, e, this.listeners);
      this.res = new ServerResponse(ctx, e);
      if (!this.fired) {
        this.fired = true;
        connectionListener(req, this.res);
      }
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
    if (options['keystore']) var context = ks.setup(options['keystore']);
    if (options['handler']) var handler = options['handler'];
    var connectionListener = arguments[1];
  }

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

    args.call(this, Array.prototype.slice.call(arguments));

    var internalAddress = new InetSocketAddress(host, port);
    var factory = new NioServerSocketChannelFactory(Dispatch.getGlobalQueue(),
                                                    Dispatch.getGlobalQueue());
    var bootstrap = new ServerBootstrap(factory);

    bootstrap.setPipelineFactory(Pipeline(connectionListener, {'context':context, 'handler':handler}));
    bootstrap.bind(internalAddress);

    com.sprintstack.Environment.incrementShutdownLock();
  };

}

exports.createServer = function(options, fn) {
  return new Server(options, fn);
};

exports.Server = Server;
exports.Pipeline = Pipeline;
exports.IncomingMessage = IncomingMessage;
exports.ServerRequest = ServerRequest;
exports.ServerResponse = ServerResponse;

