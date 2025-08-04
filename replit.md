# Competitor Pricing Tracker Dashboard

## Overview

This is a full-stack web application built for tracking and analyzing competitor pricing strategies. The system provides a comprehensive dashboard to monitor pricing changes, detect market trends, and receive alerts about competitor activities. Built with React frontend, Express backend, and PostgreSQL database, it offers real-time insights for competitive intelligence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom design system variables
- **Charts**: Recharts for data visualization and pricing trend displays
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API structure with dedicated route handlers
- **Storage Layer**: Abstracted storage interface with in-memory implementation (designed for easy database migration)
- **Middleware**: Custom request logging, JSON parsing, and error handling
- **Development**: Vite middleware integration for seamless full-stack development

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema synchronization
- **Connection**: Neon Database serverless PostgreSQL for cloud deployment
- **Data Models**: Competitors, pricing plans, price history, and alerts with relational structure
- **Temporary Storage**: In-memory storage implementation for development and testing

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **Security**: CORS configuration and request validation middleware
- **Current State**: Basic session infrastructure in place, ready for authentication implementation

### External Dependencies
- **Database Hosting**: Neon Database for serverless PostgreSQL
- **UI Components**: Radix UI for accessible, unstyled components
- **Form Handling**: React Hook Form with Zod validation schemas
- **Development Tools**: ESBuild for server bundling, TSX for TypeScript execution
- **Monitoring**: Custom request logging and error tracking

The architecture follows a clean separation of concerns with shared TypeScript schemas between frontend and backend, ensuring type consistency across the full stack. The modular design allows for easy scaling and feature additions while maintaining code quality and developer experience.