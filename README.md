# NestJS Clean Architecture Project

A robust NestJS application implementing Clean Architecture principles with TypeScript, featuring authentication, WebSocket integration, and MySQL database with Prisma ORM.

## 🏗️ Architecture

This project strictly follows Clean Architecture principles with the following layer structure:

```
src/
├── core/                     # Enterprise & Application Business Rules
│   ├── domain/              # Enterprise Business Rules
│   │   ├── entities/        # Business entities
│   │   ├── repositories/    # Repository interfaces
│   │   └── dtos/           # Data Transfer Objects
│   ├── use-cases/          # Application Business Rules
│   │   ├── auth/          # Authentication use cases
│   │   ├── user/          # User management use cases
│   │   └── stream/        # Streaming use cases
│   ├── filters/           # Global exception filters
│   └── config/            # Application configuration
│
├── infrastructure/          # Frameworks & Drivers
│   ├── auth/              # Authentication implementation
│   │   ├── guards/       # JWT & Role guards
│   │   └── strategies/   # Passport strategies
│   ├── prisma/          # Database configuration & service
│   └── websocket/       # WebSocket implementation
│
└── interface/            # Interface Adapters
    ├── controllers/     # HTTP Controllers
    ├── gateways/       # WebSocket Gateways
    ├── modules/        # NestJS modules
    └── repositories/   # Repository implementations
```

### Layer Responsibilities

1. **Core Layer** (Enterprise & Application Business Rules)

   - `domain/`: Contains enterprise business rules, entities, and interfaces
   - `use-cases/`: Implements application-specific business rules
   - `filters/`: Global exception handling
   - `config/`: Application configuration and constants

2. **Infrastructure Layer** (Frameworks & Drivers)

   - `auth/`: Authentication implementation details
   - `prisma/`: Database access and ORM configuration
   - `websocket/`: Real-time communication implementation

3. **Interface Layer** (Interface Adapters)
   - `controllers/`: HTTP request handlers
   - `gateways/`: WebSocket event handlers
   - `modules/`: NestJS module definitions
   - `repositories/`: Concrete implementations of repository interfaces

### Clean Architecture Principles

1. **Dependency Rule**

   - Dependencies only point inward
   - Inner layers have no knowledge of outer layers
   - Outer layers depend on inner layers through interfaces

2. **Separation of Concerns**

   - Business logic is isolated in the core layer
   - Framework-specific code is in the infrastructure layer
   - Interface adapters handle external communication

3. **Independence of Frameworks**

   - Core business logic is framework-agnostic
   - NestJS is treated as a delivery mechanism
   - Database and external services are abstracted through interfaces

4. **Testability**
   - Business rules can be tested without external dependencies
   - Use cases are isolated and independently testable
   - Mock implementations can be easily substituted

## 🚀 Features

- **Clean Architecture Implementation**

  - Strict separation of concerns
  - Domain-driven design
  - SOLID principles

- **Authentication & Authorization**

  - JWT-based authentication
  - Role-based access control
  - Secure password hashing
  - Protected routes

- **Database Integration**

  - MySQL with Prisma ORM
  - Repository pattern
  - Type-safe database queries
  - Migrations support

- **API Documentation**

  - Swagger/OpenAPI integration
  - Detailed API documentation
  - Interactive API testing
  - DTOs & validation

- **Real-time Features**
  - WebSocket support
  - Real-time updates
  - Connection management
  - Event handling

## 🛠️ Technologies

- NestJS v10
- TypeScript v5
- Prisma ORM
- MySQL v8
- Socket.IO v4
- Swagger/OpenAPI
- JWT & Passport
- Class Validator

## 📋 Prerequisites

- Node.js (v18 or higher)
- MySQL v8
- npm or yarn

## 🔧 Installation

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd nestjs-clean-architecture
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. Configure your .env file:
   \`\`\`
   DATABASE_URL="mysql://user:password@localhost:3306/your_database"
   JWT_SECRET="your-secret-key"
   JWT_EXPIRATION="1d"
   \`\`\`

5. Run database migrations:
   \`\`\`bash
   npx prisma migrate dev
   \`\`\`

## 🚀 Running the Application

### Development

\`\`\`bash
npm run start:dev
\`\`\`

### Production

\`\`\`bash
npm run build
npm run start:prod
\`\`\`

## 📚 API Documentation

Access Swagger documentation at: \`http://localhost:3000/api\`

### Main Endpoints

#### Authentication

- POST `/auth/login` - User login
- POST `/auth/register` - User registration

#### Users

- GET `/users` - Get all users
- GET `/users/:id` - Get user by ID
- PUT `/users/:id` - Update user
- DELETE `/users/:id` - Delete user

## 🔒 Authentication

The project uses JWT for authentication:

1. Register a new user
2. Login to get JWT token
3. Use token in Authorization header:
   \`\`\`
   Authorization: Bearer <your-token>
   \`\`\`

## 🧪 Testing

\`\`\`bash

# Unit tests

npm run test

# e2e tests

npm run test:e2e

# Test coverage

npm run test:cov
\`\`\`

## 📝 Clean Architecture Principles

1. **Independence of Frameworks**

   - Core business logic is independent of frameworks
   - External frameworks are treated as tools

2. **Testability**

   - Business rules can be tested without external elements
   - No need for database, UI, or any external agency

3. **Independence of UI**

   - UI can change without changing the system
   - Web, console, or API can be swapped

4. **Independence of Database**

   - Business rules are not bound to the database
   - Database can be swapped out

5. **Independence of External Agency**
   - Business rules don't know anything about outside interfaces
   - External services are pluggable

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📄 License

This project is licensed under the MIT License.
"# nestJs-clean-achitechture"
"# stream-platform-be"
