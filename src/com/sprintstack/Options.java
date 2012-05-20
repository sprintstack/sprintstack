package com.sprintstack;

import joptsimple.OptionParser;
import joptsimple.OptionSet;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedList;

public class Options {

    // Extremely simple for now; just passes the path of the
    // supplied file or a tempfile for in-line eval
    public static String[] process(String[] args) {
        LinkedList<String> paths = new LinkedList<String>();
        OptionParser parser = new OptionParser();
        parser.accepts("e").withRequiredArg().describedAs("Evaluate string");
        parser.accepts("h", "Show command line options");
        try {
            OptionSet options = parser.parse(args);
            if (options.has("h")) {
                printHelp(parser);
                return null;
            }
            if (options.has("e")) 
                try {
                    Path tempfile = Files.createTempFile(null, null);
                    String code = (String)options.valueOf("e");
                    Files.write(tempfile, code.getBytes("UTF-8"));
                    paths.add(tempfile.toString());
                } catch (IOException e) {
                    System.out.println("Couldn't create tempfile for in-line eval.");
                    System.exit(1);
                }
            for (String path : options.nonOptionArguments()) paths.add(path);
            return (String[])paths.toArray();
        } catch (RuntimeException e) {
            return printHelp(parser);
        }
    }

    private static String[] printHelp(OptionParser o) {
        try {
            o.printHelpOn(System.out);
        } catch (IOException e) {}
        return null;
    }

}
