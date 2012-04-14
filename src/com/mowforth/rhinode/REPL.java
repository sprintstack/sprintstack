package com.mowforth.rhinode;

import java.io.IOException;
import javax.script.ScriptEngine;
import javax.script.ScriptException;
import jline.*;

class REPL {

    private ConsoleReader console;
    private ScriptEngine engine;

    public REPL(ScriptEngine e) {
        try {
            console = new ConsoleReader();
            console.setDefaultPrompt(">");
        } catch (IOException x) {}
        engine = e;
    }

    public void start() {
        String input;
        try {
            while ((input = console.readLine()) != null) {
                try {
                    Object out = engine.eval(input);
                    System.out.println(out.toString());
                } catch (ScriptException e) {
                    System.out.println(e);
                }
                System.out.println();
            }
        } catch (IOException e) {
                System.out.println(e);
                //                System.exit(1);
            }
    }

    private int occurrencesOf(String source, String pattern) {
        String[] chars = source.split("");
        return 1;
    }
    
}
