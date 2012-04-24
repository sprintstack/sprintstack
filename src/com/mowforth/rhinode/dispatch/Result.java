package com.mowforth.rhinode.dispatch;

public class Result {

    private String err;
    private Object result;

    public Result(String e, Object r) {
        err = e;
        result = r;
    }

}
