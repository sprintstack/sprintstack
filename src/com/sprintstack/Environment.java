package com.sprintstack;

import java.nio.file.*;
import java.util.concurrent.Executor;
import org.jboss.netty.util.HashedWheelTimer;
import org.fusesource.hawtdispatch.Dispatch;

public class Environment {

    private final static HashedWheelTimer systemTimer = new HashedWheelTimer();
    private final static Executor globalExecutor = Dispatch.getGlobalQueue();

    public static String corePath() {
        return getJarPath().getParent().resolve("../resources/").normalize().toString();
    }

    protected static String bootstrapPath() {
        return getJarPath().getParent().resolve("../resources/module.js").normalize().toString();
    }

    private static Path getJarPath() {
        return Paths.get(SprintStack.class.getProtectionDomain().getCodeSource().getLocation().getPath());
    }

    public static HashedWheelTimer getSystemTimer() { return systemTimer; }

    public static Executor getDefaultDispatcher() { return globalExecutor; }

}
