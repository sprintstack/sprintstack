package com.mowforth.rhinode.core;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;

public class IPath {

    public static String normalize(String p) {
        Path path = Paths.get(p);
        return path.normalize().toString();
    }

    public static String join(String... paths) {
        String[] tail = Arrays.copyOfRange(paths, 1, paths.length);
        Path path = Paths.get(paths[0], tail);
        return normalize(path.toString());
    }

    public static String resolve(String source, String dest) {
        Path a = Paths.get(source);
        Path b = Paths.get(dest);
        return a.resolve(b).toString();
    }

    public static String relativize(String from, String to) {
        Path a = Paths.get(from);
        Path b = Paths.get(to);
        return a.relativize(b).toString();
    }

    public static boolean exists(String path) {
        Path p =  Paths.get(path);
        return Files.exists(p);
    }

}
