package com.mowforth.rhinode;

import java.io.IOException;
import jline.*;
import com.mowforth.rhinode.dispatch.Dispatch;

class REPL {

    private ConsoleReader console;
    private ScriptEngine engine;
    private int parseDepth;
    private String buffer;

    public REPL(ScriptEngine e) {
        try {
            console = new ConsoleReader();
        } catch (IOException x) {
            System.out.println("Couldn't open console.");
            System.exit(1);
        }

        Runtime.getRuntime().addShutdownHook(new Thread() {
                public void run() {
                    Dispatch.getSystem().shutdown();
                    System.out.println("\nCaught ^C, shutting down...");
                }
        });

        engine = e;
        parseDepth = 0;
        buffer = "";
    }

    public void start() {
        String input, prompt;
        try {
            while (true) {
                prompt = ">";
                if (parseDepth > 0) prompt = "...";

                input = console.readLine(prompt);


                    Object out = engine.eval(input);
                    System.out.println(out);

            }
        } catch (IOException e) {
                System.out.println(e);
                System.exit(1);
            }
    }

    private void getParseDepth(String input) {
        String[] tokens = {"{", "[", "("};
        String compacted = input.replaceAll("\\s+$", "");
        System.out.println(compacted);
        for (String t : tokens) {
            if (compacted.endsWith(t)) {
                parseDepth++;
            }
        }
    }

    private int occurrencesOf(String source, String pattern) {
        String[] chars = source.split(""); int num = 0;
        for (String c : chars) { if (c.equals(pattern)) num++; }
        return num;
    }

}
