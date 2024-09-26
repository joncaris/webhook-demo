package com.example.consumer_java;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;



@RestController
public class WebhookController {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired // Inject the RestTemplate bean
    private RestTemplate restTemplate;

    @PostConstruct
    public void subscribeOnStartup() {
        // Subscribe to the 'order.created' event
        subscribeToEvent("order.created", "http://consumer-java-service:9000/webhook");
    }

    private void subscribeToEvent(String event, String webhookUrl) {
        // Prepare the subscription data
        Map<String, String> subscriptionData = new HashMap<>();
        subscriptionData.put("userId", "user123"); // Replace with your actual user ID
        subscriptionData.put("event", event);
        subscriptionData.put("webhookUrl", webhookUrl);

        // Set headers for JSON content
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Create the request entity
        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(subscriptionData, headers);

        // Send the subscription request
        try {
            restTemplate.postForEntity("http://producer-service:3001/subscribe", requestEntity, String.class);
            System.out.println("Subscribed to event: " + event);
        } catch (Exception e) {
            System.err.println("Error subscribing to event: " + e.getMessage());
        }
    }
    
    @PostMapping("/webhook")
    public String handleWebhook(@RequestBody String payload) {
        try {
            WebhookData webhookData = objectMapper.readValue(payload, WebhookData.class);

            // Extract the event type
            String event = webhookData.getEvent();

            // Handle different event types
            switch (event) {
                case "order.created":
                    // Handle order creation event
                    System.out.println("Order created: " + webhookData.getData());
                    break;
                case "order.shipped":
                    // Handle order shipped event
                    System.out.println("Order shipped: " + webhookData.getData());
                    break;
                default:
                    // Handle unknown events
                    System.out.println("Unknown event: " + event);
            }

            return "Webhook received!";
        } catch (Exception e) {
            // Handle parsing or processing errors
            System.err.println("Error processing webhook: " + e.getMessage());
            return "Error processing webhook";
        }
    }
}
