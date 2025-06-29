# InversifyJS + FastifyJS Boilerplate

A modern TypeScript boilerplate using InversifyJS, FastifyJS, TSOA, Swagger, Zod, and Prisma following clean architecture principles with hexagonal design.

## Features

- **TypeScript**: Fully typed codebase using ECMAScript 2024
- **Clean Architecture**: Domain-driven design with hexagonal architecture principles
- **InversifyJS**: Powerful dependency injection
- **FastifyJS**: High performance web framework
- **TSOA**: TypeScript OpenAPI generator with automatic routes
- **Swagger**: API documentation
- **Zod**: Schema validation for request/response
- **Prisma**: Type-safe ORM with PostgreSQL
- **Jest**: Testing framework
- **Docker**: Container support for both development and production

## Project Structure

```
├── prisma/                # Prisma schema and migrations
├── src/
│   ├── application/       # Application layer: use cases and DTOs
│   │   ├── dtos/         # Data transfer objects
│   │   ├── services/     # Application services
│   │   └── useCases/     # Business use cases
│   ├── domain/           # Domain layer: business logic
│   │   ├── entities/     # Domain entities
│   │   ├── repositories/ # Repository interfaces
│   │   ├── services/     # Domain services
│   │   └── valueObjects/ # Value objects
│   ├── infrastructure/   # Infrastructure layer: frameworks and tools
│   │   ├── config/       # Application configuration
│   │   ├── database/     # Database connection
│   │   ├── repositories/ # Repository implementations
│   │   └── server/       # Server implementation
│   ├── interface/        # Interface layer: controllers and routes
│   │   ├── controllers/  # API controllers
│   │   ├── middleware/   # HTTP middleware
│   │   └── validators/   # Request validators
│   ├── shared/           # Shared resources
│   │   ├── types/        # Type definitions
│   │   └── utils/        # Utility functions
│   └── generated/        # Auto-generated files
└── index.ts              # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- Docker and Docker Compose

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/inversifyjs-fastifyjs-boilerplate.git
cd inversifyjs-fastifyjs-boilerplate
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env file as needed
```

4. Start the database:

```bash
docker-compose up -d
```

5. Run database migrations:

```bash
npm run prisma:migrate
```

6. Generate TSOA routes and swagger specs:

```bash
npm run swagger:generate
```

7. Start the development server:

```bash
npm run dev
```

Visit `http://localhost:3000/docs` to view the Swagger documentation.

### Building for Production

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## Docker

To build and run the application using Docker:

```bash
# Build the image
docker build -t inversifyjs-fastifyjs-app .

# Run the container
docker run -p 3000:3000 --env-file .env inversifyjs-fastifyjs-app
```

Or use Docker Compose:

```bash
docker-compose up --build
```

## License

MIT