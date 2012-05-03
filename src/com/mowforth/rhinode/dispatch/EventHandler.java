package com.mowforth.rhinode.dispatch;

public class EventHandler {

    private String eventName;
    private IFunction handler;

    public EventHandler(String event, IFunction listener) {
        this.eventName = event;
        this.handler = listener;
    }

    public String getEvent() {
        return eventName;
    }

    public IFunction getHandler() {
        return handler;
    }

}
