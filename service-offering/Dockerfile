FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY target/service-offering-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 2000
ENTRYPOINT ["java", "-Xmx256m", "-jar", "app.jar"]
