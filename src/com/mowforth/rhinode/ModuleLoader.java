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
import org.json.simple.JSONObject;

public class ModuleLoader {

    private static FileSystem jar;

    private static Path resolve(String name) {
        // Test if we're referring to a core module-
        // First, we need to unzip the JAR
        setupJarFS();
        
        Path resource = jar.getPath("/resources/" + name + ".js");

        if (Files.exists(resource)) {
            return resource;
        } else {
            // Failing that, check if we're looking for a
            // local file
            Path localPath = Paths.get(name);
            if (Files.exists(localPath)) {
                    // Is localPath a file or folder?
                    if (Files.isRegularFile(localPath)) {
                        return localPath;
                    } else {
                        // Look for package.json
                        Path packageJson = localPath.resolve("package.json");
                        if (Files.exists(packageJson)) {
                            String mainPath = parsePackage(packageJson);
                            return Paths.get(mainPath);
                        }
                    }
            }
        }

        return null;
    }

    private static String parsePackage(Path path) {
        String json = loadFile(path);
        JSONObject parsed = JSON.decode(json);
        String main = (String)parsed.get("main");
        return main;
    }

    private static void setupJarFS() {
        if (jar == null) {
            try {
                Path jarPath = Paths.get(Rhinode.class.getProtectionDomain().getCodeSource().getLocation().getPath());
                HashMap<String,String> options = new HashMap<String,String>();
                URI jarURI = URI.create("jar:file:" + jarPath.toUri().getPath());
                jar = FileSystems.newFileSystem(jarURI, options);
            } catch (IOException e) {
                System.out.println("Couldn't read core library file.");
                System.exit(1);
            }
        }
    }

    private static String loadFile(Path path) {
        try {
            byte[] bytes = Files.readAllBytes(path);
            return new String(bytes);
        } catch (IOException e) { return null; }
    }

    public static Object require(String name, ScriptEngine engine) {
        return require(name, engine, null);
    }

    public static Object require(String name, ScriptEngine engine, Object exports) {
        Path module = resolve(name);
        String source = loadFile(module);
        try {
            if (exports != null) engine.put("exports", exports);
            SimpleScriptContext ctx = new SimpleScriptContext();
            Object e = engine.eval(source, ctx);
            return e;
        } catch (ScriptException e) { System.out.println(e); return null; }
    }
}
