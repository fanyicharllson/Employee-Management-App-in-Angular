# Multi-stage Dockerfile for ems_backend (Spring Boot 3, Java 21)
# Build stage
FROM eclipse-temurin:21-jdk AS build

WORKDIR /workspace

# Leverage Maven Wrapper present in the project
# Copy only the files necessary to resolve dependencies first (better layer caching)
COPY pom.xml .
COPY .mvn/ .mvn/
COPY mvnw mvnw

# Pre-fetch dependencies (go offline) to leverage Docker layer cache
RUN ./mvnw -q -e -DskipTests dependency:go-offline

# Now copy the rest of the source
COPY src ./src

# Build the application (skip tests by default for container build; can enable via build-arg)
ARG SKIP_TESTS=true
RUN if [ "$SKIP_TESTS" = "true" ]; then \
      ./mvnw -q -DskipTests package; \
    else \
      ./mvnw -q package; \
    fi

# Runtime stage
FROM eclipse-temurin:21-jre-alpine AS runtime

# Install minimal tools for healthcheck (nc)
RUN apk add --no-cache busybox-extras

# Add a non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /workspace/target/ems_backend-0.0.1-SNAPSHOT.jar app.jar

# Environment configuration (can be overridden at runtime)
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75 -XX:InitialRAMPercentage=50 -XX:+UseG1GC -Djava.security.egd=file:/dev/./urandom" \
    SPRING_MAIN_BANNER-MODE=off \
    SERVER_PORT=8080

# Expose the application port
EXPOSE 8080

# Healthcheck (Spring Boot actuator not configured; use TCP check)
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD nc -z localhost 8080 || exit 1

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
