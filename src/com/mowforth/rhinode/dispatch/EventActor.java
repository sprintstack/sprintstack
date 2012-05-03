package com.mowforth.rhinode.dispatch;

import akka.actor.UntypedActor;
import java.util.Iterator;
import java.util.concurrent.CopyOnWriteArraySet;

public class EventActor extends UntypedActor {

    private CopyOnWriteArraySet<EventHandler> listeners;

    @Override
    public void preStart() {
        listeners = new CopyOnWriteArraySet<EventHandler>();
    }

    @Override
    public void onReceive(Object message) {
        if (message instanceof Event) {
            Event e = (Event)message;
            applyToHandlers(e);
        } else if (message instanceof EventHandler) {
            EventHandler e = (EventHandler)message;
            System.out.println("handler: " + e.getEvent());
            listeners.add(e);
        }
    }

    private void applyToHandlers(Event e) {
        String message = e.getName();
        Object argument = e.getArgument();
        Iterator<EventHandler> i = listeners.iterator();
        while (i.hasNext()) {
            EventHandler h = i.next();
            if (h.getEvent().equals(message)) {
                if (h.getHandler() != null) {
                    h.getHandler().apply(argument);
                    if (h.runOnce()) listeners.remove(h);
                }
            }
        }
    }

}
