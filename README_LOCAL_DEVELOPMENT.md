# ScribeArena Local Development Setup

This guide explains how to run ScribeArena locally using Docker Compose for a complete development environment.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your machine
- [Docker Compose](https://docs.docker.com/compose/install/) installed
- [Git](https://git-scm.com/downloads) for cloning the repository
- An [OpenAI API key](https://platform.openai.com/api-keys) for AI functionality

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd scribearena
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-actual-openai-api-key-here
   ```

3. **Start the development environment**
   ```bash
   docker-compose up -d
   ```

4. **Initialize the database schema**
   ```bash
   # Wait for containers to be healthy, then run database migrations
   docker-compose exec app npm run db:push
   ```

5. **Access the application**
   - ScribeArena: http://localhost:5000
   - Database: localhost:5432 (if you need direct access)

## Development Commands

### Container Management
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app
docker-compose logs -f postgres

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up --build -d
```

### Database Operations
```bash
# Run database migrations/schema updates
docker-compose exec app npm run db:push

# Access PostgreSQL directly
docker-compose exec postgres psql -U scribearena_user -d scribearena

# Reset database (removes all data)
docker-compose down -v
docker-compose up -d
docker-compose exec app npm run db:push
```

### Application Development
```bash
# Install new dependencies
docker-compose exec app npm install <package-name>

# Run tests (if available)
docker-compose exec app npm test

# Access container shell
docker-compose exec app sh
```

## Environment Configuration

The `.env` file contains all necessary configuration:

- **OPENAI_API_KEY**: Your OpenAI API key for AI scribe functionality
- **DATABASE_URL**: PostgreSQL connection string (auto-configured for Docker)
- **NODE_ENV**: Set to `development` for local development
- **PORT**: Application port (default: 5000)

## Database Schema

The application uses Drizzle ORM for database operations. Schema files are located in:
- `shared/schema.ts` - Main schema definitions
- `server/db.ts` - Database connection setup

## Troubleshooting

### Port Conflicts
If port 5000 or 5432 are already in use:
```bash
# Edit docker-compose.yml to use different ports
# For example, change "5000:5000" to "3000:5000"
```

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# View PostgreSQL logs
docker-compose logs postgres

# Restart database service
docker-compose restart postgres
```

### Application Not Starting
```bash
# Check application logs
docker-compose logs app

# Rebuild the application container
docker-compose build app
docker-compose up -d app
```

### OpenAI API Issues
- Verify your API key is correct in `.env`
- Check your OpenAI account has available credits
- Ensure the API key has proper permissions

## File Structure

```
scribearena/
├── docker-compose.yml     # Docker services configuration
├── Dockerfile            # Application container definition
├── .env.example          # Environment variables template
├── init.sql             # Database initialization script
├── client/              # Frontend React application
├── server/              # Backend Express application
├── shared/              # Shared TypeScript schemas
└── package.json         # Node.js dependencies
```

## Production Deployment

For production deployment:
1. Use production-grade PostgreSQL (not Docker container)
2. Set `NODE_ENV=production` in environment
3. Use proper session secrets and security configurations
4. Consider using a reverse proxy (nginx) for SSL termination
5. Set up proper logging and monitoring

## Support

If you encounter issues:
1. Check the logs: `docker-compose logs -f`
2. Verify environment variables in `.env`
3. Ensure Docker has sufficient resources allocated
4. Check the GitHub issues for known problems