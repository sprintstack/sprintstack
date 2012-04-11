package com.mowforth.rhinode;

import javax.script.*;
import java.nio.file.*;
import java.io.IOException;

public class Rhinode {
    public static void main(String[] args) {
    
        ScriptEngineManager factory = new ScriptEngineManager();
        ScriptEngine engine = factory.getEngineByName("JavaScript");

        String source = readFile("test.js");
        try {
            engine.eval(source);
        } catch (ScriptException e) {}

        System.exit(0);
    }

    public static String readFile(String file) {
        Path path = FileSystems.getDefault().getPath(file);
        try {
            byte[] bytes = Files.readAllBytes(path);
            return new String(bytes);
        } catch (IOException e) { return ""; }
    }
}
