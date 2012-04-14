package com.mowforth.rhinode;

import java.io.IOException;
import javax.script.ScriptEngine;
import javax.script.ScriptException;
import jline.*;

class REPL {

    private ConsoleReader console;
    private ScriptEngine engine;
    private int parseDepth;

    public REPL(ScriptEngine e) {
        try {
            console = new ConsoleReader();
        } catch (IOException x) {
            System.out.println("Couldn't open console.");
            System.exit(1);
        }

        Runtime.getRuntime().addShutdownHook(new Thread() {
                public void run() {
                    System.out.println("\nCaught ^C, shutting down...");
                }
        });
        
        engine = e;
        parseDepth = 0;
    }

    public void start() {
        String input, prompt;
        try {
            while (true) {
                prompt = ">";
                if (parseDepth > 0) prompt = "...";

                input = console.readLine(prompt);

                try {
                    Object out = engine.eval(input);
                    System.out.print(out);
                } catch (ScriptException e) {
                    System.out.println(e);
                }
                System.out.println();
            }
        } catch (IOException e) {
                System.out.println(e);
                System.exit(1);
            }
    }

    private int occurrencesOf(String source, String pattern) {
        String[] chars = source.split(""); int num = 0;
        for (String c : chars) { if (c.equals(pattern)) num++; }
        return num;
    }
    
}
