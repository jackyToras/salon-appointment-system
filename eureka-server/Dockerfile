FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY target/netflix-eureka-server-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-Xmx256m", "-jar", "app.jar"]
