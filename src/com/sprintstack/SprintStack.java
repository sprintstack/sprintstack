package com.sprintstack;

import com.sprintstack.dispatch.Dispatch;
import org.mozilla.javascript.tools.shell.Main;

public class SprintStack {

    public static void main(String[] args) {
        Dispatch.setupSystem();

        if (args.length == 1 && args[0].equals("-worker")) {
            System.out.println("just a worker bee...");
        } else {
            Main.setBootstrap(ModuleLoader.require("module"));
            Main.main(args);
        }

        if (Dispatch.getAwait()) Dispatch.getSystem().awaitTermination();
        System.exit(0);
    }

}
