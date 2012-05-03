package com.mowforth.rhinode;

import com.mowforth.rhinode.dispatch.Dispatch;

class Environment {

    private static ScriptEngine defaultEngine;

    public static ScriptEngine newScriptEngine() {
        ScriptEngine engine = new ScriptEngine();
        ModuleLoader.require("module", null, engine);
        ModuleLoader.require("callback", null, engine);
        return engine;
    }

    public static ScriptEngine getDefaultEngine() {
        if (defaultEngine == null) {
            Dispatch.setupSystem();
            defaultEngine = newScriptEngine();
            ModuleLoader.require("bootstrap", null, defaultEngine);
        }
        return defaultEngine;
    }

}
