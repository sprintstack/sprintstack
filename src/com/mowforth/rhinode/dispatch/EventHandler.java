package com.mowforth.rhinode.dispatch;

public class EventHandler {

    private String eventName;
    private IFunction handler;
    private boolean runOnce;

    public EventHandler(String event, IFunction listener) {
        this.eventName = event;
        this.handler = listener;
        this.runOnce = false;
    }

    public EventHandler(String event, IFunction listener, boolean once) {
        this.eventName = event;
        this.handler = listener;
        this.runOnce = once;
    }

    public String getEvent() {
        return eventName;
    }

    public IFunction getHandler() {
        return handler;
    }

    public boolean runOnce() {
        return runOnce;
    }

}
