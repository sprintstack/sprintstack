package com.mowforth.rhinode.core.io;

import akka.actor.ActorRef;
import akka.actor.Props;
import static akka.actor.Actors.poisonPill;
import org.jboss.netty.channel.ChannelHandlerContext;
import org.jboss.netty.channel.ChannelEvent;
import org.jboss.netty.channel.ChannelStateEvent;
import org.jboss.netty.channel.MessageEvent;
import org.jboss.netty.channel.SimpleChannelUpstreamHandler;
import com.mowforth.rhinode.dispatch.Dispatch;

public class INetServerHandler extends SimpleChannelUpstreamHandler {

    private ActorRef actor;

    @Override
    public void channelOpen(ChannelHandlerContext ctx, ChannelStateEvent e) throws Exception {
        if (actor == null) {
            actor = Dispatch.getSystem().actorOf(new Props(INetActor.class));
        }
    }

    @Override
    public void channelConnected(ChannelHandlerContext ctx, ChannelStateEvent e) throws Exception {
        actor.tell("connected");
    }

    @Override
    public void channelDisconnected(ChannelHandlerContext ctx, ChannelStateEvent e) throws Exception {
        actor.tell("disconnected");
    }

    @Override
    public void channelClosed(ChannelHandlerContext ctx, ChannelStateEvent e) throws Exception {
        actor.tell(poisonPill());
    }

    @Override
    public void messageReceived(ChannelHandlerContext ctx, MessageEvent e) {
        actor.tell("incoming!");
        actor.tell(e);
    }

}
