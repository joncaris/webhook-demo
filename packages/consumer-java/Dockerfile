# Use the official OpenJDK image as the base
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven project files
COPY pom.xml .

# Download Maven dependencies (this can be optimized further)
RUN mvn dependency:go-offline

# Copy the rest of the application code
COPY . .

# Build the Java application
RUN mvn package

# Expose the port your app will listen on (adjust if needed)
EXPOSE 9000

# Start the Java application
CMD ["java", "-jar", "target/consumer-java-0.0.1-SNAPSHOT.jar"] 