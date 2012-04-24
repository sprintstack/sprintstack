package com.mowforth.rhinode;

public class Rhinode {

    public static void main(String[] args) {
        if (args.length == 0) {
            REPL r = new REPL(Environment.getDefaultEngine());
            r.start();
        } else {
            String scriptName = args[args.length-1];
            ModuleLoader.require(scriptName);
        }

        System.exit(0);
    }

}
