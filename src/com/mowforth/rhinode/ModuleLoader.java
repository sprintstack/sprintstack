package com.mowforth.rhinode;

import java.nio.file.Files;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.net.URI;
import java.util.HashMap;
import java.io.IOException;
import org.json.simple.JSONObject;

import com.mowforth.rhinode.util.JSON;

public class ModuleLoader {

    private static FileSystem jar;

    private static Path resolve(String name) {
        return resolve(name, null);
    }

    private static Path resolve(String name, String ext) {
        // Test if we're referring to a core module
        Path resource = getJarPath().getParent().resolve("../resources/" + name + ".js").normalize();

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
                            return resolve(localPath.resolve(mainPath).toString());
                        }
                    }
            }
        }

        try {
            return bouncePath(name, ext);
        } catch (IOException e) {
            return null;
        }
    }

    private static Path bouncePath(String name, String ext) throws IOException {
        if (ext == null) {
            return resolve(name.concat(".js"), "js");
        } else if (ext == "js") {
            String prefix = name.substring(0, (name.length()-2));
            return resolve(prefix.concat("json"), "json");
        } else {
            throw new IOException();
        }
    }

    public static String resolveString(String id) {
        return resolve(id).getParent().toString();
    }

    private static String parsePackage(Path path) {
        String json = loadFile(path);
        JSONObject parsed = JSON.decode(json);
        String main = (String)parsed.get("main");
        return main;
    }

    private static Path getJarPath() {
        return Paths.get(Rhinode.class.getProtectionDomain().getCodeSource().getLocation().getPath());
    }

    private static String loadFile(Path path) {
        try {
            byte[] bytes = Files.readAllBytes(path);
            return new String(bytes);
        } catch (IOException e) { return null; }
    }

    public static String require(String name) {
        Path module = resolve(name);
        if (module == null) return null;
        return loadFile(module);
    }

}
