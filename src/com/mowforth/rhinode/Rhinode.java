package com.mowforth.rhinode;

import javax.script.*;

public class Rhinode {

    private static ScriptEngine engine;

    public static void main(String[] args) {
    
        ScriptEngineManager factory = new ScriptEngineManager();
        engine = factory.getEngineByName("JavaScript");

        ModuleLoader.require("module", engine);
        ModuleLoader.require("base", engine);

        REPL r = new REPL(engine);
        r.start();

        System.exit(0);
    }

    public static ScriptEngine getEngine() {
        return engine;
    }

}
