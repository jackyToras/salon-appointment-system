FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY target/payment-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 6000
ENTRYPOINT ["java", "-Xmx256m", "-jar", "app.jar"]
