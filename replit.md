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
- **Delta Intelligence System**: Added comprehensive Deltas summary page with 6 tracking categories and individual Delta Feed with real-time competitive intelligence
- **Enhanced Feed with Filtering**: Rebuilt Feed page as time-series delta tracking with fuzzy search, severity filtering, and categorized intelligence cards
- **Example Note Tool**: Added comprehensive SOAP note comparison functionality allowing clinicians to test AI scribe outputs using standardized patient visits with embedded video demonstrations
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
- **Table-like Comparison**: Redesigned comparison page with grid-based table layout for easier line-by-line vendor comparison
- **Simplified Formatting**: Streamlined pricing card display with consistent padding and reduced visual complexity

### UI/UX Improvements
- Renamed platform from "PriceTracker" to "ScribeArena" for better market positioning
- Streamlined comparison interface by removing social media elements and optimizing for full-screen width
- Added timestamp display near refresh controls in sidebar navigation
- Implemented section-by-section SOAP note editor for custom clinical documentation
- Enhanced vendor cards with larger logos, "Visit Website" buttons, and improved spacing
- Added YouTube video embed for Freed AI demo (https://www.youtube.com/watch?v=ueSwbb7we44) in Example Note tool
- Set monthly pricing as default view for individuals with automatic free plan prioritization
- Made reviews tab content take full width for better readability
- Added "Show 10 more" pagination button with loading animation for reviews (displays 10 initially, loads 10 more on demand)
- Expanded sample review data to 29 total reviews across all vendors for realistic pagination demonstration

### Delta Intelligence Features (January 2025)
- **Deltas Summary Page**: Six comprehensive tracking categories including pricing changes, feature updates, market position, customer sentiment, compliance updates, and integration ecosystem
- **Delta Feed Page**: Individual delta cards in chronological time series with title, subheading, source links, category/subcategory tags, severity ratings (0-10 with color-coded indicators), and dates
- **Advanced Filtering**: Real-time fuzzy text search across all delta fields and severity-based filtering (High 8-10, Med 5-7, Low 0-4)
- **Category System**: 12 delta categories covering fundraising, pricing, features, competitor entry, security, personnel, partnerships, reviews, API/SDK releases, media appearances, blog content, and data breaches
- **Demo Functionality**: "Add Demo Delta" button with loading animation that adds new sample deltas to demonstrate real-time feed updates
- **Navigation Reorganization**: Feed tab repositioned below Deltas in sidebar navigation for logical information hierarchy

### Local Development Infrastructure (January 2025)
- **Docker Compose Setup**: Complete containerized development environment with PostgreSQL database and application services
- **Environment Configuration**: Comprehensive .env.example with OpenAI API key, PostgreSQL connection strings, and development settings
- **Database Initialization**: Automated PostgreSQL setup with proper permissions, health checks, and schema management
- **Development Documentation**: Detailed README_LOCAL_DEVELOPMENT.md with setup instructions, troubleshooting, and Docker commands
- **Health Monitoring**: Docker health checks with /health endpoint for service monitoring and container orchestration
- **Production Ready**: Dockerfile with multi-stage build, security configurations, and deployment optimization