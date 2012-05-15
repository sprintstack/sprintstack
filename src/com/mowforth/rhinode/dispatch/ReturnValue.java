package com.mowforth.rhinode.dispatch;

class ReturnValue {

    private Object val;

    public ReturnValue(Object val) {
        this.val = val;
    }

    public Object getValue() {
        return val;
    }

}
