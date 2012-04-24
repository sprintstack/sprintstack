package com.mowforth.rhinode;

import com.mowforth.rhinode.dispatch.Dispatch;

class Environment {

    private static ScriptEngine defaultEngine;

    public static ScriptEngine newScriptEngine() {
        ScriptEngine engine = new ScriptEngine();
        Object ret = ModuleLoader.require("module", null, engine);
        return engine;
    }

    public static ScriptEngine getDefaultEngine() {
        if (defaultEngine == null) {
            Dispatch.setupSystem();
            defaultEngine = newScriptEngine();
        }
        return defaultEngine;
    }

}
