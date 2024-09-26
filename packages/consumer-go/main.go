package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

func main() {
	err := subscribeToEvent("order.created", "http://consumer-go-service:8080/webhook")
	if err != nil {
		log.Fatal("Error subscribing to event:", err)
	}

	http.HandleFunc("/webhook", handleWebhook)

	fmt.Println("Webhook consumer listening on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func subscribeToEvent(event string, webhookUrl string) error {
	// Prepare the subscription data
	subscriptionData := map[string]string{
		"userId":     "user123", // Replace with your actual user ID
		"event":      event,
		"webhookUrl": webhookUrl,
	}

	// Marshal the subscription data into JSON
	jsonData, err := json.Marshal(subscriptionData)
	if err != nil {
		return err
	}

	// Create a POST request to the producer's /subscribe endpoint
	resp, err := http.Post("http://producer-service:3001/subscribe", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// Check the response status code
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("subscription failed with status code: %d", resp.StatusCode)
	}

	if resp.StatusCode == http.StatusOK {
		fmt.Println("Subscription successful!")
	}

	return nil
}

func handleWebhook(w http.ResponseWriter, r *http.Request) {
	// Read the request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return

	}

	// Parse the JSON payload
	var webhookData map[string]interface{}
	err = json.Unmarshal(body, &webhookData)
	if err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	// Extract the event type
	event, ok := webhookData["event"].(string)
	if !ok {
		http.Error(w, "Missing or invalid 'event' field", http.StatusBadRequest)
		return
	}

	// Respond to the webhook
	fmt.Fprintf(w, "Webhook received!")

	// Handle different event types
	switch event {
	case "order.created":
		// Handle order creation event
		fmt.Println("Order created:", webhookData["data"])
	case "order.shipped":
		// Handle order shipped event
		fmt.Println("Order shipped:", webhookData["data"])
	default:
		// Handle unknown events
		fmt.Println("Unknown event:", event)
	}

}
