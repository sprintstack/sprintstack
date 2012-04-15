package com.mowforth.rhinode;

import javax.script.*;

class Environment {

    private static ScriptEngineManager manager;
    private static ScriptEngine defaultEngine;

    public static ScriptEngine newScriptEngine() {
        if (manager == null) manager = new ScriptEngineManager();
        return manager.getEngineByName("JavaScript");
    }

    public static ScriptEngine getDefaultEngine() {
        if (defaultEngine == null) defaultEngine = newScriptEngine();
        return defaultEngine;
    }

}
