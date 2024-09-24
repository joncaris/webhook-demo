package com.example.consumer_java;

public class WebhookData {
    private String event;
    private Object data; // We'll use a generic Object for now

    // Getters and setters for event and data
    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;

    }
}
