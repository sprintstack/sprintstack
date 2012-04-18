package com.mowforth.rhinode;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.EcmaError;
import org.mozilla.javascript.ImporterTopLevel;
import org.mozilla.javascript.JavaAdapter;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;


class ScriptEngine {

    private Context ctx;
    private Scriptable scope;

    public ScriptEngine() {
        ctx = Context.enter();
        scope = ctx.initStandardObjects();
        scope = new ImporterTopLevel(ctx);
    }

    public Object eval(String input) {
        return eval(input, "<anonymous>");
    }

    public Object eval(String input, String modName) {
        try {
            return ctx.evaluateString(scope, input, modName, 1, null);
        } catch (EcmaError e) {
            System.out.println(e);
            return null;
        }
    }

    public void put(String key, Object value) {
        Object wrapped = Context.javaToJS(value, scope);
        ScriptableObject.putProperty(scope, key, wrapped);
    }

    public Object get(String key) {
        return ScriptableObject.getProperty(scope, key);
    }

    protected void finalize() {
        Context.exit();
    }

}
