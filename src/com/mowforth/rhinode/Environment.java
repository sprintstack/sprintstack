package com.mowforth.rhinode;

class Environment {

    private static ScriptEngine defaultEngine;

    public static ScriptEngine newScriptEngine() {
        ScriptEngine engine = new ScriptEngine();
        Object ret = ModuleLoader.require("module", null, engine);
        if (ret != null) ModuleLoader.require("error", null, engine);
        return engine;
    }

    public static ScriptEngine getDefaultEngine() {
        if (defaultEngine == null) defaultEngine = newScriptEngine();
        return defaultEngine;
    }

}
