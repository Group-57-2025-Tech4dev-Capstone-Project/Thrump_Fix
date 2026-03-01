# Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the built JAR
COPY --from=build /app/target/Thrump_Fix-0.0.1-SNAPSHOT.jar app.jar

# Create non-root user (simplified)
RUN addgroup --system appuser && \
    adduser --system --no-create-home --ingroup appuser appuser
USER appuser

# Use Render's PORT environment variable
EXPOSE ${PORT:-8081}

# Run the app
ENTRYPOINT ["java", "-Xmx300m", "-XX:+UseSerialGC", "-jar", "app.jar"]
