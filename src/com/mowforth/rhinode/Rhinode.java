package com.mowforth.rhinode;

import javax.script.*;

public class Rhinode {

    private static ScriptEngine engine;

    public static void main(String[] args) {
    
        ScriptEngineManager factory = new ScriptEngineManager();
        engine = factory.getEngineByName("JavaScript");

        ModuleLoader.require("bootstrap", engine);
        ModuleLoader.require("base", engine);

        System.exit(0);
    }

    public static ScriptEngine getEngine() {
        return engine;
    }

}
