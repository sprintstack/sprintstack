package com.mowforth.rhinode;

import javax.script.*;

class Environment {

    private static ScriptEngineManager manager;
    private static ScriptEngine defaultEngine;

    public static ScriptEngine newScriptEngine() {
        if (manager == null) manager = new ScriptEngineManager();
        ScriptEngine engine = manager.getEngineByName("JavaScript");
        ModuleLoader.require("module", null, engine);
        return engine;
    }

    public static ScriptEngine getDefaultEngine() {
        if (defaultEngine == null) defaultEngine = newScriptEngine();
        return defaultEngine;
    }

}
