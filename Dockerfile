# Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and download dependencies (caching optimization)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the built JAR from build stage
COPY --from=build /app/target/Thrump_Fix-0.0.1-SNAPSHOT.jar app.jar

# Create non-root user for security
RUN addgroup --system --gid 1001 appuser && \
    adduser --system --uid 1001 --gid 1001 appuser
USER appuser

# Use Render's PORT environment variable
EXPOSE ${PORT:-8081}

# Run with memory limits
ENTRYPOINT ["java", \
    "-Xmx300m", \
    "-XX:+UseSerialGC", \
    "-jar", "app.jar"]
