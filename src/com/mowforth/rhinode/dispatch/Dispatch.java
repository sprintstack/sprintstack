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
import akka.dispatch.OnComplete;
import akka.japi.Function;
import akka.util.Duration;
import akka.util.Timeout;
import java.lang.Runnable;
import java.util.concurrent.Callable;
import java.util.concurrent.TimeUnit;

public class Dispatch {

    private static ActorSystem system;

    public static void setupSystem() {
        if (system == null) system = ActorSystem.create("RhinodeMaster");
    }

    public static ActorSystem getSystem() {
        return system;
    }

    public static Future<Object> future(Callable<Object> work, OnComplete<Object> callback) {
        Future<Object> f = Futures.future(work, system.dispatcher()).andThen(callback);
        return f;
    }

    public static Agent<Object> agent(Object initial) {
        return new Agent<Object>(initial, system);
    }

    public static Cancellable doOnce(Runnable work, int delay) {
        Duration d = Duration.create(delay, TimeUnit.MILLISECONDS);
        return system.scheduler().scheduleOnce(d, newActor(), work);
    }

    public static Cancellable doRegularly(Runnable work, int delay) {
        Duration d = Duration.create(delay, TimeUnit.MILLISECONDS);
        return system.scheduler().schedule(Duration.Zero(), d, newActor(), work);
    }

    public static ActorRef newActor() {
        ActorRef actor = system.actorOf(new Props().withCreator(new UntypedActorFactory() {
                public UntypedActor create() {
                    return new UntypedActor() {
                        public void onReceive(Object message) {
                            if (message instanceof Runnable) {
                                Runnable work = (Runnable)message;
                                work.run();
                            } else {
                                unhandled(message);
                            }
                        }
                    };
                        }
            }));

        return actor;
    }

    public static Timeout forever() {
        return new Timeout(5, TimeUnit.SECONDS);
    }

}
