package com.sprintstack;

import java.nio.file.*;

public class Environment {

    public static String corePath() {
        return getJarPath().getParent().resolve("../resources/").normalize().toString();
    }

    protected static String bootstrapPath() {
        return getJarPath().getParent().resolve("../resources/module.js").normalize().toString();
    }

    private static Path getJarPath() {
        return Paths.get(SprintStack.class.getProtectionDomain().getCodeSource().getLocation().getPath());
    }

}
