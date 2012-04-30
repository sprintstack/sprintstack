package com.mowforth.rhinode.core.io;

import akka.actor.UntypedActor;
import com.mowforth.rhinode.dispatch.IFunction;
import org.jboss.netty.channel.MessageEvent;

public class INetActor extends UntypedActor {

    public void onReceive(Object message) {
        if (message instanceof String) {
            System.out.println(message);
        } else if (message instanceof MessageEvent) {
            MessageEvent e = (MessageEvent)message;
            System.out.println(e.getMessage());
            e.getChannel().write(e.getMessage());
        }
    }

}
