package com.mowforth.rhinode.dispatch;

import akka.actor.ActorRef;
import akka.actor.Address;
import akka.actor.Props;
import akka.routing.RemoteRouterConfig;
import akka.routing.RoundRobinRouter;
import java.io.IOException;
import javax.jmdns.JmDNS;
import javax.jmdns.ServiceEvent;
import javax.jmdns.ServiceInfo;
import javax.jmdns.ServiceListener;
import java.util.concurrent.CopyOnWriteArraySet;

public class SystemDiscovery {

    private static JmDNS browser;
    private static String serviceName = "_hog._tcp.local.";
    private static CopyOnWriteArraySet<ActorRef> systems;

    private static void setupJmDNS() {
        if (browser == null) {
            systems = new CopyOnWriteArraySet<ActorRef>();
            systems.add(localRoutee());
            try {
                browser = JmDNS.create();
                browser.registerServiceType(serviceName);
            } catch (IOException e) {
                System.out.println("Couldn't create MDNS instance.");
            }
        }
    }

    private static ActorRef localRoutee() {
        return Dispatch.getSystem().actorOf(new Props(EventListenerActor.class).withRouter(new RoundRobinRouter(5)));
    }

    private static ActorRef createRoutee(Address address) {
        Address[] addrs = { address };
        return Dispatch.getSystem().actorOf(new Props(EventListenerActor.class).withRouter(new RemoteRouterConfig(new RoundRobinRouter(25),
                                                                                                                  addrs)));
    }

    public static void announce(String systemName, String appName) {
        setupJmDNS();
        ServiceInfo service = ServiceInfo.create(serviceName, systemName, 8080, appName);
        try  {
            browser.registerService(service);
        } catch (IOException e) {
            System.out.println("Couldn't register service.");
        }
    }

    public static void listen() {
        setupJmDNS();
        browser.addServiceListener(serviceName, new ServiceListener() {
                public void serviceResolved(ServiceEvent e) {
                    ServiceInfo info = e.getInfo();
                    Address address = new Address("akka", info.getName(), info.getHostAddress(), info.getPort());
                    ActorRef routee = createRoutee(address);
                    systems.add(routee);
                }

                public void serviceAdded(ServiceEvent e) {
                }

                public void serviceRemoved(ServiceEvent e) {
                    System.out.println("removed");
                }
            });
    }

}

