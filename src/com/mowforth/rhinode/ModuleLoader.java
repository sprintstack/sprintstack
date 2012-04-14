package com.mowforth.rhinode;

import java.nio.file.Files;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.net.URI;
import java.util.HashMap;
import java.io.IOException;
import javax.script.*;

class ModuleLoader {

    private static FileSystem jar;

    private static Path resolve(String name) {
        // Test if we're referring to a core module-
        // First, we need to unzip the JAR
        setupJarFS();
        
        Path resource = jar.getPath("/resources/" + name + ".js");

        if (Files.exists(resource)) {
            return resource;
        } 

        return null;
    }

    private static void setupJarFS() {
        if (jar == null) {
            try {
                Path jarPath = Paths.get(Rhinode.class.getProtectionDomain().getCodeSource().getLocation().getPath());
                HashMap<String,String> options = new HashMap<String,String>();
                URI jarURI = URI.create("jar:file:" + jarPath.toUri().getPath());
                jar = FileSystems.newFileSystem(jarURI, options);
            } catch (IOException e) {}
        }
    }

    private static String loadFile (Path path) {
        try {
            byte[] bytes = Files.readAllBytes(path);
            return new String(bytes);
        } catch (IOException e) { return null; }
    }

    public static Object require (String name, ScriptEngine engine) {
        Path module = resolve(name);
        String source = loadFile(module);
        try {
            Object e = engine.eval(source);
            return e;
        } catch (ScriptException e) { return null; }
    }
}
