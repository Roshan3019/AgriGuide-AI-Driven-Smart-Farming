# AgriGuide — AI-Driven Smart Farming

A production-ready full-stack MVP to help Indian farmers, especially beginners, with field management, soil analysis, crop recommendations, irrigation planning, disease detection, and more.

## Tech Stack

- **Backend**: Node.js + TypeScript with NestJS
- **Database**: PostgreSQL
- **Frontend**: React + TypeScript + Tailwind CSS
- **ML Service**: Python with FastAPI (for disease detection)
- **Infrastructure**: Docker & docker-compose

## Project Structure

- `/backend/` - NestJS API server
- `/frontend/` - React web app
- `/ml-service/` - Python ML microservice
- `/docs/` - Documentation
- `/deploy/` - Docker and deployment files

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (local installation or Docker)

### Backend Setup
1. Navigate to backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your PostgreSQL credentials
4. Run the backend: `npm run start:dev`

### Frontend Setup
1. Navigate to frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Run the frontend: `npm run dev`

### Database
- Create a PostgreSQL database named `agri_guide`
- The app uses TypeORM with synchronize=true for development

## API Documentation
- Swagger/OpenAPI docs available at `/docs` when backend is running

## Contributing

This is a learning project. Follow the sprint-based development approach.