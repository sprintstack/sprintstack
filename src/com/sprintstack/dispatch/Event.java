package com.sprintstack.dispatch;

public class Event {

    private String name;
    private Object argument;

    public Event(String name) {
        this.name = name;
    }

    public Event(String name, Object argument) {
        this.name = name;
        this.argument = argument;
    }

    public String getName() {
        return name;
    }

    public Object getArgument() {
        return argument;
    }

}
