# ScribeArena - AI Medical Scribe Competitive Intelligence Platform

## Overview

ScribeArena is a comprehensive competitive intelligence platform for AI medical scribe products, providing in-depth insights into vendor digital performance, pricing strategies, and clinical documentation capabilities. The system enables healthcare professionals and organizations to compare AI scribe solutions through pricing analysis, SEO tracking, vendor comparison tools, and standardized clinical note evaluation.

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

### Key Features
- **Vendor Comparison**: Side-by-side analysis of up to 3 AI scribe vendors with pricing, SEO metrics, and feature comparison
- **Example Note Generator**: Clinical documentation testing tool using standardized patient visits with real AI scribe outputs in SOAP format
- **Feed System**: Vendor updates from official blog sources and market news with chronological ordering
- **SEO Analytics**: Comprehensive tracking of domain ratings, meta descriptions, and technical SEO attributes
- **Pricing Intelligence**: Real-time monitoring of competitor pricing plans and feature sets

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

## Recent Updates (August 2025)

### Major Feature Additions
- **Example Note Tool**: Added comprehensive SOAP note comparison functionality allowing clinicians to test AI scribe outputs using standardized patient visits
- **Vendor Comparison Enhancement**: Implemented max 3 vendor selection with side-by-side pricing, SEO, and feature analysis
- **Navigation Restructure**: Moved refresh/export controls and ScribeArena branding to sidebar navigation for cleaner interface
- **Clinical Documentation Testing**: Integrated real patient transcript with AI-generated SOAP notes from multiple vendors
- **Shared Experience System**: Added API endpoints and display for vendor-specific clinical experience submissions with transcription duration tracking

### Dashboard Enhancements (August 2025)
- **Plan Filtering**: Added individual vs group plan filtering with clear tab controls
- **Billing Toggle**: Implemented monthly/annual pricing toggle with button group interface
- **Free Tier Integration**: Added free tier plans for all vendors assigned to individuals category
- **Vertical Card Layout**: Redesigned pricing layout to stack each AI scribe as separate vertical cards with website links
- **Simplified Interface**: Removed price alerts, trends, comparison tables, and charts for cleaner focus on core product comparison
- **Enhanced Pricing Display**: Added annual discount pricing (20% savings) with responsive grid layout for pricing plans

### UI/UX Improvements
- Renamed platform from "PriceTracker" to "ScribeArena" for better market positioning
- Streamlined comparison interface by removing social media elements and optimizing for full-screen width
- Added timestamp display near refresh controls in sidebar navigation
- Implemented section-by-section SOAP note editor for custom clinical documentation
- Enhanced vendor cards with larger logos, "Visit Website" buttons, and improved spacing
- Set monthly pricing as default view for individuals with automatic free plan prioritization