package com.sprintstack.core;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.FileSystem;
import java.nio.file.WatchService;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;


public class IFS {

    public static void writeFile(String filename, String data) {
        Path file = Paths.get(filename);
        try {
            Files.write(file, data.getBytes());
        } catch (IOException e) {
            System.out.println(e);
        }
    }

}
