package com.sprintstack;

import com.sprintstack.dispatch.Dispatch;
import org.mozilla.javascript.tools.shell.Main;

public class SprintStack {

    public static void main(String[] args) {
        Main.setBootstrap(Environment.bootstrapPath());
        Main.main(args);

        if (Dispatch.getAwait()) Dispatch.getSystem().awaitTermination();
        System.exit(0);
    }


}

