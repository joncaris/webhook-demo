# Use the official Go image as the base
FROM golang:1.21

# Set the working directory inside the container
WORKDIR /app

# Copy the Go module files
COPY go.mod go.sum ./

# Download Go modules
RUN go mod download

# Copy the rest of the application code
COPY . .

# Build the Go executable
RUN go build -o consumer-go .

# Expose the port your app will listen on
EXPOSE 8080

# Start the Go application
CMD ["./consumer-go"]