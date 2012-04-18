package com.mowforth.rhinode;

class Environment {

    private static ScriptEngine defaultEngine;

    public static ScriptEngine newScriptEngine() {
        ScriptEngine engine = new ScriptEngine();
        ModuleLoader.require("module", null, engine);
        return engine;
    }

    public static ScriptEngine getDefaultEngine() {
        if (defaultEngine == null) defaultEngine = newScriptEngine();
        return defaultEngine;
    }

}
