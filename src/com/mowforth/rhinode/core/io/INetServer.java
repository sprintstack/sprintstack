package com.mowforth.rhinode.core.io;

import java.net.InetSocketAddress;
import java.util.concurrent.Executors;
import org.jboss.netty.bootstrap.ServerBootstrap;
import org.jboss.netty.channel.socket.nio.NioServerSocketChannelFactory;

public class INetServer {

    private InetSocketAddress address;

    public INetServer(int port) {
        this.address = new InetSocketAddress(port);
    }

    public void run() {
        NioServerSocketChannelFactory factory = new NioServerSocketChannelFactory(Executors.newSingleThreadExecutor(),
                                                                                  Executors.newSingleThreadExecutor());
        ServerBootstrap bootstrap = new ServerBootstrap(factory);
        bootstrap.setPipelineFactory(new INetServerPipelineFactory());
        
        bootstrap.bind(address);
    }

}
