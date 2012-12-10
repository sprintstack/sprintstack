package com.sprintstack;

import org.mozilla.javascript.tools.shell.Main;

public class SprintStack {

    public static void main(String[] args) {
        Main.setBootstrap(Environment.bootstrapPath());
        Main.main(args);

        Environment.getShutdownLock().arriveAndAwaitAdvance();
        System.exit(0);
    }


}

