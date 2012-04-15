package com.mowforth.rhinode;

import javax.script.*;

public class Rhinode {

    private static ScriptEngine engine;

    public static void main(String[] args) {

        ModuleLoader.require("module");
        ModuleLoader.require("base");

        REPL r = new REPL(Environment.getDefaultEngine());
        r.start();

        System.exit(0);
    }

}
