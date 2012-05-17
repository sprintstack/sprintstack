package com.mowforth.rhinode.dispatch;

import akka.actor.ActorSystem;
import akka.actor.ActorRef;
import akka.actor.Props;
import akka.actor.UntypedActor;
import akka.actor.UntypedActorFactory;
import akka.actor.Cancellable;
import akka.agent.Agent;
import akka.dispatch.Future;
import akka.dispatch.Futures;
import akka.japi.Function;
import akka.util.Duration;
import akka.util.Timeout;
import java.lang.Runnable;
import java.util.concurrent.Callable;
import java.util.concurrent.TimeUnit;

public class Dispatch {

    private static ActorSystem system;

    public static void setupSystem() {
        if (system == null) {
            system = ActorSystem.create("RhinodeMaster");
            system.registerOnTermination(new Runnable() {
                    public void run() {
                        System.out.println("System shutdown.");
                    }
                });
        }
    }

    public static ActorSystem getSystem() {
        return system;
    }

    public static ActorRef newEventHandler() {
        return system.actorOf(new Props(EventActor.class));
    }

}
