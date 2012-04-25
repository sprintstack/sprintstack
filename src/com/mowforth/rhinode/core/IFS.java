package com.mowforth.rhinode.core;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;

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
