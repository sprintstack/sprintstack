package com.mowforth.rhinode.core.io;

import akka.actor.UntypedActor;
import com.mowforth.rhinode.dispatch.IFunction;
import org.jboss.netty.channel.MessageEvent;
import java.util.concurrent.ConcurrentHashMap;

public class INetActor extends UntypedActor {

    private ConcurrentHashMap messageHandlers;

    public void onReceive(Object message) {
        if (messageHandlers == null) messageHandlers = new ConcurrentHashMap();
        if (message instanceof String) {
            System.out.println(message);
        } else if (message instanceof MessageEvent) {
            MessageEvent e = (MessageEvent)message;
            System.out.println(e.getMessage());
            e.getChannel().write(e.getMessage());
        }
    }

    public void postStop() {
        System.out.println("stopped...");
    }

}
