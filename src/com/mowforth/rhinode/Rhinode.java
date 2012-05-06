package com.mowforth.rhinode;

import com.mowforth.rhinode.dispatch.Dispatch;
import org.mozilla.javascript.tools.shell.Main;

public class Rhinode {

    public static void main(String[] args) {
        Dispatch.setupSystem();
        Main.setBootstrap(ModuleLoader.require("module"));
        Main.main(args);
    }

}
