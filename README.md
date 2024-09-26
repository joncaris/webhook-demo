# webhook-demo

## Overview
This project demonstrates a simple webhook system built using a Lerna monorepo. It includes:
- **Producer:** A Node/Typescript application which manages webhook subscriptions in memory and triggers events. 
- **Consumers:** Multiple consumers implemented in different tech (Node.js/TypeScript, Go, Java) that subscribe to events and process webhook notifications.

## Tech
 - Node.js
 - Typescript
 - Go
 - Java
 - Docker
 - Kubernetes (Minikube, kubectl)
 - Lerna

## Installation
### 0. Prerequisits
```
    npm install -g lerna
    brew update
    brew install kubectl
    brew cask install docker
    brew cask install minikube
```

### 1. Clone the repository:
```
    git clone https://github.com/joncaris/webhook-demo.git
    cd webhooks-demo
```

### 2. Install Dependencies:
```
    lerna bootstrap
```

### 3. Build Docker Images:
```
    eval $(minikube -p minikube docker-env) # Configure terminal for Minikube's Docker environment
    lerna run build-image

```

### 4. Deploy to K8s:
```
    kubectl apply -f packages/producer/producer-deployment.yaml
    kubectl apply -f packages/producer/producer-service.yaml
    kubectl apply -f packages/consumer-node/consumer-node-deployment.yaml
    kubectl apply -f packages/consumer-node/consumer-node-service.yaml
    kubectl apply -f packages/consumer-go/consumer-go-deployment.yaml
    kubectl apply -f packages/consumer-go/consumer-go-service.yaml
    kubectl apply -f packages/consumer-java/consumer-java-deployment.yaml
    kubectl apply -f packages/consumer-java/consumer-java-service.yaml
```

## Running the app
### Development
### - Start Producers and Consumers:
```
    lerna run start --parallel
```

### Kubernetes
### - Get pod info:
```
    kubectl get pods
```

### - View logs
```
    kubectl logs <pod-name> -f
```


## Testing the webhooks
### 1. Subscriptions:
Subscribe to Events: Each consumer will send a POST request to the producer's /subscribe endpoint when it initializes.

### 2.Trigger Events: 
Use Postman or similar to send POST requests to the producer's /trigger_event endpoint to simulate events and observe the webhook deliveries to the consumers. You'll need to make sure you can tunnel into the producer service.
```
    // get the url of the producer service and send a request to http://<ip:port>/trigger_event
    minikube service producer-service --url

    // your payload can be raw JSON and look like this
    {
        "event": "order.created",
        "data": {
            "order_id": 12345,
            "customer_name": "Jimmy",
            "total_amount": 99.99
        }
    }
```

### 3.Monitor Logs:  
Use `kubectl logs` to view the logs of your producer and consumer pods in real-time and verify the webhook interactions.


