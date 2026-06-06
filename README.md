graph TD
    %% Styling and Definitions
    classDef infra fill:#f9f,stroke:#333,stroke-width:2px;
    classDef core fill:#bbf,stroke:#333,stroke-width:2px;
    classDef client fill:#bfb,stroke:#333,stroke-width:1px;

    %% Client Layer
    Client([Client Browser]) -->|Port 3001| Frontend[frontend]
    Frontend -->|HTTP Requests| Gateway[gateway-service <br> Port 8862]

    %% Gateway and Infrastructure Interaction
    subgraph Infrastructure Layer
        Gateway -->|Validate JWT| Keycloak[keycloak <br> Port 8180]
        Gateway -->|Discover Services| Eureka[eureka-server <br> Port 8761]
        
        UserSvc[user-service <br> Port 1000] -.->|Register / Discover| Eureka
        SalonSvc[salon-service <br> Port 3000] -.->|Register / Discover| Eureka
        CatSvc[category-service <br> Port 4000] -.->|Register / Discover| Eureka
        OffringSvc[service-offering <br> Port 2000] -.->|Register / Discover| Eureka
        BookingSvc[booking-service <br> Port 5000] -.->|Register / Discover| Eureka
        PaySvc[payment-service <br> Port 6000] -.->|Register / Discover| Eureka
        NotifSvc[notification-service <br> Port 7000] -.->|Register / Discover| Eureka
    end

    %% Gateway Routing to Core Services
    Gateway -->|Route| UserSvc
    Gateway -->|Route| SalonSvc
    Gateway -->|Route| CatSvc
    Gateway -->|Route| OffringSvc
    Gateway -->|Route| BookingSvc
    Gateway -->|Route| PaySvc
    Gateway -->|Route| NotifSvc

    UserSvc -->|Auth Sync| Keycloak

    %% Asynchronous Event-Driven Layer
    subgraph Event Broker
        RabbitMQ[(RabbitMQ <br> Port 5672 / 15672)]
    end

    BookingSvc -->|Publish Booking Events| RabbitMQ
    RabbitMQ -.->|Consume Events| PaySvc
    RabbitMQ -.->|Consume Events| NotifSvc

    %% Class Assigns
    class Keycloak,RabbitMQ,Eureka,Gateway infra;
    class UserSvc,SalonSvc,CatSvc,OffringSvc,BookingSvc,PaySvc,NotifSvc core;
    class Frontend,Client client;