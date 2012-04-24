package com.mowforth.rhinode.dispatch;

public class Logging {

    public static void info(Object message) {
        Dispatch.getSystem().log().info(message.toString());
    }

    public static void warn(Object message) {
        Dispatch.getSystem().log().warning(message.toString());
    }

    public static void error(Object message) {
        Dispatch.getSystem().log().error(message.toString());
    }

}
