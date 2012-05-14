package com.mowforth.rhinode;

import com.mowforth.rhinode.dispatch.Dispatch;
import org.mozilla.javascript.tools.shell.Main;

public class Rhinode {

    public static void main(String[] args) {
        Dispatch.setupSystem();

        if (args.length == 1 && args[0].equals("-worker")) {
            System.out.println("just a worker bee...");
        } else {
            Main.setBootstrap(ModuleLoader.require("module"));
            Main.main(args);
        }
        System.exit(0);
    }

}
