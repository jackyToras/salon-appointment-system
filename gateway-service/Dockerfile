FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY target/gateway-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8862
ENTRYPOINT ["java", "-Xmx256m", "-jar", "app.jar"]
