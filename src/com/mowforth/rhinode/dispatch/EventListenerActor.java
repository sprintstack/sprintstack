package com.mowforth.rhinode.dispatch;

import akka.actor.ActorRef;
import akka.actor.Props;
import akka.actor.UntypedActor;
import java.util.Iterator;
import java.util.concurrent.CopyOnWriteArraySet;

public class EventListenerActor extends UntypedActor {

    private IFunction listener;

    public void onReceive(Object message) {
        if (message instanceof IFunction) {
            listener = (IFunction)message;
        } else {
            Object val = listener.apply(message);
            getSender().tell(new ReturnValue(val));
        }
    }

}
