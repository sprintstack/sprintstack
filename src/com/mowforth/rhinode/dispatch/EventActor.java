package com.mowforth.rhinode.dispatch;

import akka.actor.ActorRef;
import akka.actor.Props;
import akka.actor.UntypedActor;
import java.util.concurrent.ConcurrentHashMap;

public class EventActor extends UntypedActor {

    private ConcurrentHashMap<String,ActorRef> listeners;

    @Override
    public void preStart() {
        listeners = new ConcurrentHashMap<String,ActorRef>();
    }

    @Override
    public void onReceive(Object message) {
        if (message instanceof Event) {
            Event e = (Event)message;
            ActorRef responder = listeners.get(e.getName());
            if (responder != null) responder.tell(e.getArgument());
        } else if (message instanceof EventHandler) {
            ActorRef listener = spawn();
            EventHandler e = (EventHandler)message;
            listener.tell(e.getHandler());
            listeners.put(e.getEvent(), listener);
        }
    }

    private ActorRef spawn() {
        return getContext().actorOf(new Props(EventListenerActor.class));
    }

}
