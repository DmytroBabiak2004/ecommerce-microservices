# E-Commerce Microservices - Setup Guide

## Project Structure

```
lab3/
├── src/
│   ├── ApiGateway/              # Ocelot API Gateway (Port 5000)
│   ├── ProductService/          # Product & Category Management (Port 5001)
│   ├── OrderService/            # Order Management with RabbitMQ (Port 5002)
│   └── UserService/             # User Authentication with Identity (Port 5003)
├── docker-compose.yml           # Docker Compose configuration
├── ECommerceMicroservices.sln   # Visual Studio solution
└── README.md

```

## Architecture

### Services
1. **API Gateway** - Routes all external requests to appropriate microservices
2. **Product Service** - CRUD operations for products and categories (via API Gateway)
3. **Order Service** - Order management with event-driven architecture using RabbitMQ
4. **User Service** - Authentication and user management with Microsoft Identity

### Infrastructure Components
- **SQL Server** - Three separate databases (ProductsDb, OrdersDb, UsersDb)
- **RabbitMQ** - Message broker for event-driven communication
- **Jaeger** - OpenTelemetry tracing and observability
- **Ocelot** - API Gateway for routing

## Prerequisites

1. .NET 8.0 SDK - https://dotnet.microsoft.com/download
2. Docker Desktop - https://www.docker.com/products/docker-desktop
3. Visual Studio 2022 or VS Code (optional)

## Quick Start - Docker Compose (Recommended)

### Step 1: Navigate to project directory
```bash
cd "C:\Users\Roman PC\OneDrive\Desktop\uni_fourth_year\first_sem\software_architecture_and_design\lab3"
```

### Step 2: Build and run all services
```bash
docker-compose up --build
```

This command will:
- Start SQL Server container
- Start RabbitMQ container
- Start Jaeger tracing container
- Build and start all 4 microservices
- Run database migrations automatically
- Seed data into all databases

### Step 3: Wait for services to be ready
Wait about 30-60 seconds for all services to start up completely.

### Step 4: Access the services

**Service URLs:**
- API Gateway: http://localhost:5000
- Product Service (direct): http://localhost:5001/swagger
- Order Service (direct): http://localhost:5002/swagger
- User Service (direct): http://localhost:5003/swagger

**Infrastructure URLs:**
- RabbitMQ Management: http://localhost:15672 (username: guest, password: guest)
- Jaeger Tracing UI: http://localhost:16686

## Running Locally (Without Docker)

### Step 1: Start infrastructure services
```bash
docker-compose up sqlserver rabbitmq jaeger
```

### Step 2: Update connection strings
Update the connection strings in each service's appsettings.json file if needed.

### Step 3: Run each service
Open 4 separate terminal windows and run:

**Terminal 1 - Product Service:**
```bash
cd src/ProductService
dotnet run
```

**Terminal 2 - Order Service:**
```bash
cd src/OrderService
dotnet run
```

**Terminal 3 - User Service:**
```bash
cd src/UserService
dotnet run
```

**Terminal 4 - API Gateway:**
```bash
cd src/ApiGateway
dotnet run
```

## Testing the Application

### 1. Register a new user
```bash
curl -X POST http://localhost:5000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }'
```
Save the token from the response.

### 3. Get all products
```bash
curl http://localhost:5000/products
```

### 4. Get all categories
```bash
curl http://localhost:5000/categories
```

### 5. Create an order (publishes event to RabbitMQ)
```bash
curl -X POST http://localhost:5000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "totalAmount": 0,
    "orderItems": [
      {
        "productId": 1,
        "productName": "Laptop",
        "quantity": 1,
        "unitPrice": 999.99
      }
    ]
  }'
```

### 6. View order events in RabbitMQ
1. Go to http://localhost:15672
2. Login with guest/guest
3. Click on "Queues" tab
4. You should see order-created events

### 7. View traces in Jaeger
1. Go to http://localhost:16686
2. Select a service from dropdown
3. Click "Find Traces"
4. View distributed tracing information

## Seed Data

### Users (UserService)
- **Admin**: admin@ecommerce.com / Admin@123 (Role: Admin)
- **Customer 1**: john.doe@example.com / Customer@123 (Role: Customer)
- **Customer 2**: jane.smith@example.com / Customer@123 (Role: Customer)

### Categories (ProductService)
1. Electronics
2. Clothing
3. Books
4. Home & Garden

### Products (ProductService)
- Laptop ($999.99) - Electronics
- Smartphone ($699.99) - Electronics
- Headphones ($199.99) - Electronics
- T-Shirt ($19.99) - Clothing
- Jeans ($49.99) - Clothing
- Sneakers ($79.99) - Clothing
- Programming Book ($39.99) - Books
- Novel ($14.99) - Books
- Garden Tools Set ($89.99) - Home & Garden
- LED Light Bulbs ($24.99) - Home & Garden

### Orders (OrderService)
3 sample orders are pre-seeded with various products and statuses.

## Database Migrations

Migrations run automatically on service startup. Each service:
1. Checks for pending migrations
2. Applies migrations to the database
3. Seeds initial data if tables are empty

To create new migrations manually:
```bash
cd src/ProductService
dotnet ef migrations add InitialCreate
```

## Stopping Services

### Docker Compose:
```bash
docker-compose down
```

To also remove volumes (databases):
```bash
docker-compose down -v
```

### Local:
Press Ctrl+C in each terminal window.

## Troubleshooting

### Issue: Services can't connect to SQL Server
**Solution**: Wait longer for SQL Server to fully start (can take 30-60 seconds)

### Issue: Port already in use
**Solution**: Stop any services using ports 5000-5003, 1433, 5672, or 15672

### Issue: RabbitMQ connection failed
**Solution**: Ensure RabbitMQ container is running: `docker ps | grep rabbitmq`

### Issue: Database migrations fail
**Solution**: 
1. Stop all services
2. Run `docker-compose down -v` to remove volumes
3. Run `docker-compose up --build` again

## Project Technologies

- **ASP.NET Core 8.0** - Web framework
- **Entity Framework Core 8.0** - ORM for database access
- **Ocelot 23.2** - API Gateway
- **MassTransit 8.2** - Distributed application framework for RabbitMQ
- **Microsoft Identity** - Authentication and authorization
- **OpenTelemetry** - Distributed tracing and observability
- **SQL Server 2022** - Relational database
- **RabbitMQ** - Message broker
- **Jaeger** - Distributed tracing backend
- **Docker & Docker Compose** - Containerization

## API Endpoints Reference

### Through API Gateway (http://localhost:5000)

**Products:**
- GET /products - Get all products
- GET /products/{id} - Get product by ID
- POST /products - Create new product
- PUT /products/{id} - Update product
- DELETE /products/{id} - Delete product

**Categories:**
- GET /categories - Get all categories
- GET /categories/{id} - Get category by ID
- POST /categories - Create new category
- PUT /categories/{id} - Update category
- DELETE /categories/{id} - Delete category

**Orders:**
- GET /orders - Get all orders
- GET /orders/{id} - Get order by ID
- POST /orders - Create new order (triggers RabbitMQ event)
- PUT /orders/{id} - Update order
- DELETE /orders/{id} - Delete order

**Users:**
- POST /users/register - Register new user
- POST /users/login - Login user (returns JWT token)
- GET /users/profile - Get user profile (requires authentication)

## Key Features Implemented

✅ Microservices Architecture with 4 services
✅ API Gateway using Ocelot for request routing
✅ Event-driven architecture with RabbitMQ for OrderService
✅ Microsoft Identity for authentication and authorization
✅ JWT token-based authentication
✅ OpenTelemetry for distributed tracing
✅ Jaeger for trace visualization
✅ Automatic database migrations on startup
✅ Seed data for all services
✅ SQL Server with separate databases per service
✅ Docker Compose for easy deployment
✅ CORS enabled for cross-origin requests
✅ Swagger documentation for each service

## Next Steps

1. Add API versioning
2. Implement health checks
3. Add rate limiting
4. Implement circuit breakers with Polly
5. Add integration tests
6. Implement response caching
7. Add API documentation with Swagger in API Gateway
8. Implement event sourcing for order history
9. Add monitoring with Prometheus and Grafana
10. Implement API key authentication for service-to-service communication
