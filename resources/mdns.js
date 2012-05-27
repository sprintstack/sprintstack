importClass(Packages.org.jboss.netty.channel.socket.nio.NioDatagramChannelFactory)
importClass(Packages.org.jboss.netty.channel.Channels);
importClass(Packages.org.jboss.netty.buffer.ChannelBuffer);
importClass(Packages.org.jboss.netty.channel.SimpleChannelUpstreamHandler);
importClass(java.net.InetSocketAddress);
importClass(java.net.NetworkInterface);

var Responder = function() {
  return new JavaAdapter(SimpleChannelUpstreamHandler, {
    messageReceived: function(ctx, e) {
      var msg = e.getMessage();
      if (msg instanceof ChannelBuffer) new DNSMessage(msg);
    }
  });
}

var Pipeline = function() {
  var pipe = Channels.pipeline();
  pipe.addLast("handler", Responder());
  return pipe;
}

var DNSMessage = function(msg) {
}

var MDNS = function() {
  var f = new NioDatagramChannelFactory();
  var channel = f.newChannel(Pipeline());
  channel.getConfig().setReuseAddress(true);
  channel.getConfig().setSendBufferSize(512);
  channel.getConfig().setReceiveBufferSize(512);

  var addr = new InetSocketAddress("224.0.0.251", 5353);
  var future = channel.bind(addr);
  future.await();
  if (future.isSuccess()) console.log('bound');

  var ifaces = NetworkInterface.getNetworkInterfaces();
  while (ifaces.hasMoreElements()) channel.joinGroup(addr, ifaces.nextElement());


};

module.exports = new MDNS();

