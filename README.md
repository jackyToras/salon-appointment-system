# Salon Booking Realm

A microservices-based online salon booking platform for college students at Jaypee University of Information Technology.

## Overview

Salon Booking Realm is a comprehensive web application that enables students to book salon services online. The system features real-time availability checking, secure payment processing via Stripe, and automated email notifications.

## Tech Stack

**Frontend:**
- React 18.x
- Tailwind CSS
- Axios

**Backend:**
- Spring Boot 3.2
- Java 17
- MongoDB
- RabbitMQ

**Infrastructure:**
- Keycloak (Authentication)
- Eureka (Service Discovery)
- Docker & Docker Compose
- Spring Cloud Gateway

**External Services:**
- Stripe (Payments)
- Cloudinary (Images)
- SMTP (Email)

## Microservices

| Service | Port | Function |
|---------|------|----------|
| User Service | 1000 | User management and authentication |
| Salon Service | 3000 | Salon profile and search |
| Service Offering | 2000 | Service catalog management |
| Category Service | 4000 | Service category management |
| Booking Service | 5000 | Appointment booking |
| Payment Service | 6000 | Payment processing |
| Notification Service | 7000 | Email notifications |
| API Gateway | 8862 | Request routing and JWT validation |

## Prerequisites

- Java JDK 17 or higher
- Docker and Docker Compose
- Node.js 14+ and npm
- Git

## Installation

### Clone Repository

```bash
git clone https://github.com/jackyToras/salon-booking-realm.git
cd salon-booking-realm
```

### Setup Environment Variables

Create a `.env` file in the project root:

```
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=salon_booking

KEYCLOAK_AUTH_SERVER_URL=http://localhost:8180
KEYCLOAK_REALM=salon-booking-realm

SPRING_RABBITMQ_HOST=localhost
SPRING_RABBITMQ_PORT=5672
SPRING_RABBITMQ_USERNAME=guest
SPRING_RABBITMQ_PASSWORD=guest

STRIPE_PUBLIC_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your_email@gmail.com
SPRING_MAIL_PASSWORD=your_app_password
```

## Quick Start

### Using Docker Compose (Recommended)

```bash
docker-compose up -d
```

All services will start automatically. Wait 2-3 minutes for all services to become healthy.

Access the application at: `http://localhost:3001`

### Running Locally

Ensure MongoDB and RabbitMQ are running first:

```bash
# Terminal 1 - Keycloak
docker run -p 8180:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:24.0 start-dev

# Terminal 2 - RabbitMQ
docker run -p 5672:5672 -p 15672:15672 rabbitmq:3-management

# Terminal 3 - MongoDB
docker run -p 27017:27017 mongo:latest

# Terminal 4 - Eureka Server
cd eureka-server && mvn spring-boot:run

# Terminal 5+ - Start each microservice
cd user-service && mvn spring-boot:run
cd salon-service && mvn spring-boot:run
cd booking-service && mvn spring-boot:run
cd payment-service && mvn spring-boot:run
cd notification-service && mvn spring-boot:run
cd service-offering && mvn spring-boot:run
cd category-service && mvn spring-boot:run

# Terminal - Gateway
cd gateway-service && mvn spring-boot:run

# Terminal - Frontend
cd frontend && npm install && npm start
```

## Service Endpoints

**Base URL:** `http://localhost:8862/api`

**Authentication Header:** `Authorization: Bearer <JWT_TOKEN>`

### User Service
- `GET /users/` - Get all users
- `POST /users/register` - Register new user
- `GET /users/{userId}` - Get user details
- `PUT /users/{userId}` - Update user profile

### Salon Service
- `GET /salons/` - Get all salons
- `POST /salons/` - Create salon
- `GET /salons/{salonId}` - Get salon details
- `PUT /salons/{salonId}` - Update salon

### Booking Service
- `POST /bookings/` - Create booking
- `GET /bookings/{bookingId}` - Get booking details
- `GET /bookings/customer/{customerId}` - Get customer bookings
- `PUT /bookings/{bookingId}/cancel` - Cancel booking

### Payment Service
- `POST /payments/create` - Create payment
- `GET /payments/{paymentId}` - Get payment status
- `POST /payments/webhook` - Stripe webhook

## Accessing Services

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3001 | - |
| API Gateway | http://localhost:8862 | - |
| Keycloak Admin | http://localhost:8180 | admin/admin |
| RabbitMQ Dashboard | http://localhost:15672 | guest/guest |
| Eureka Dashboard | http://localhost:8761 | - |

## Project Structure

```
salon-booking-realm/
├── user-service/           User management microservice
├── salon-service/          Salon management microservice
├── booking-service/        Booking management microservice
├── payment-service/        Payment processing microservice
├── notification-service/   Email notification service
├── service-offering/       Service catalog microservice
├── category-service/       Category management microservice
├── gateway-service/        API Gateway
├── eureka-server/          Service discovery
├── frontend/               React frontend application
├── docker-compose.yml      Docker compose configuration
├── .env.example            Environment variables template
└── README.md               This file
```

## Configuration

### Keycloak Setup

1. Access Keycloak Admin Console: `http://localhost:8180/admin`
2. Login with admin/admin
3. Create realm: `salon-booking-realm`
4. Create clients for each service with appropriate redirect URIs
5. Configure client credentials in .env file

### MongoDB

Default: `mongodb://localhost:27017`

Collections created automatically:
- users
- salons
- services
- bookings
- payments
- categories

### RabbitMQ

Default credentials: guest/guest

Queues:
- booking.queue
- payment.queue
- email.queue

## Docker Deployment

### Build All Services

```bash
docker-compose build
```

### Start Services

```bash
docker-compose up -d
```

### View Logs

```bash
docker-compose logs -f [service-name]
```

### Stop Services

```bash
docker-compose down
```

## Testing

### Run Unit Tests

```bash
mvn test
```

### Run Integration Tests

```bash
mvn verify
```

### Test Specific Service

```bash
cd [service-name]
mvn test
```

## Troubleshooting

### Services Won't Start

Check logs:
```bash
docker-compose logs [service-name]
docker-compose ps
```

### Port Already in Use

Stop existing services:
```bash
docker-compose down
```

### Database Connection Failed

Ensure MongoDB is running:
```bash
docker ps | grep mongo
```

Start MongoDB if needed:
```bash
docker run -p 27017:27017 mongo:latest
```

### Keycloak Realm Not Found

Import realm configuration through Keycloak Admin Console. See Configuration section.

## Features

**Customer Features:**
- User registration and authentication
- Browse and search salons
- View salon details and services
- Book salon services
- Secure online payment
- View booking history
- Cancel or reschedule appointments
- Receive booking confirmations
- Manage account settings

**Salon Owner Features:**
- Create and manage salon profiles
- Add and update services
- Manage service categories
- View all bookings
- Generate financial reports
- Upload salon images
- Monitor booking statistics

**Admin Features:**
- Manage all users
- Manage all salons
- View system-wide analytics
- Monitor system health

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add feature description"`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Support

For issues, questions, or suggestions:
- GitHub Issues: https://github.com/jackyToras/salon-booking-realm/issues

## Performance

- Response Time: < 200ms average
- Database Query Time: < 100ms
- Payment Processing: < 2 seconds
- Email Delivery: < 5 minutes
- System Uptime: 99.5%

## Version

Version 1.0.0 - May 2026

---

For detailed documentation, refer to the SRS and testing documents included in the project.
