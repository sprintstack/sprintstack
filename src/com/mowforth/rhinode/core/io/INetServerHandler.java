package com.mowforth.rhinode.core.io;

import akka.actor.ActorRef;
import org.jboss.netty.channel.ChannelHandlerContext;
import org.jboss.netty.channel.ChannelEvent;
import org.jboss.netty.channel.ChannelStateEvent;
import org.jboss.netty.channel.MessageEvent;
import org.jboss.netty.channel.SimpleChannelUpstreamHandler;

public class INetServerHandler extends SimpleChannelUpstreamHandler {

    @Override
    public void channelConnected(ChannelHandlerContext ctx, ChannelStateEvent e) throws Exception {
        System.out.println("connected");
    }

    @Override
    public void channelDisconnected(ChannelHandlerContext ctx, ChannelStateEvent e) throws Exception {
        System.out.println("disconnected");
    }

    @Override
    public void messageReceived(ChannelHandlerContext ctx, MessageEvent e) {
        System.out.println("incoming!");
        e.getChannel().write(e.getMessage());
    }

}
