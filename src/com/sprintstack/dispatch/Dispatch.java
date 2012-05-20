package com.sprintstack.dispatch;

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
import java.util.concurrent.atomic.AtomicBoolean;

public class Dispatch {

    private static ActorSystem system;
    private static AtomicBoolean await;

    public static void setupSystem() {
        if (system == null) {
            await = new AtomicBoolean(false);
            system = ActorSystem.create("SprintStackMaster");
            Runtime.getRuntime().addShutdownHook(new Thread() {
                    public void run() {
                        system.shutdown();
                    }
            });
        }
    }

    public static void setAwait() {
        await.set(true);
    }

    public static boolean getAwait() {
        return await.get();
    }

    public static ActorSystem getSystem() {
        return system;
    }

    public static ActorRef newEventHandler() {
        return system.actorOf(new Props(EventActor.class));
    }

}
