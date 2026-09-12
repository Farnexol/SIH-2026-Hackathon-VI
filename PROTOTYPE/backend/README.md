# StatIQ Backend Service

Official Competency & Capacity Building Backend for India's Official Statistical System (SIH 2026 Problem Statement SIH26101).

## Tech Stack
- **Node.js** & **Express.js** (ES Modules)
- **MongoDB** & **Mongoose**
- **JWT** (JSON Web Tokens) Authentication
- **bcryptjs** (Password Hashing)
- **Multer** (Official Statistical Document Ingestion)
- **Helmet** & **CORS** (API Security)

## Quick Start

### 1. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your MongoDB connection string is set in `MONGODB_URI`.

### 2. Seed Database
Populate official OSSF competencies, iGOT courses, diagnostic quizzes, and demo officer profile:
```bash
npm run seed
```

**Demo Credentials**:
- **Email**: `demo@statiq.ai`
- **Password**: `demo123`
- **Employee ID**: `SO-2024-8841`

### 3. Run Development Server
Run with nodemon as the main file:
```bash
nodemon index.js
# OR
node index.js
# OR
npm run dev
```
Server runs at `http://localhost:5000`.

### 4. API Endpoints
- **Health Check**: `GET /api/health`
- **Authentication**: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- **Dashboard**: `GET /api/dashboard`
- **Competencies**: `GET /api/competencies`, `GET /api/competencies/gaps`
- **Courses**: `GET /api/courses`, `GET /api/courses/:id`, `POST /api/courses/:id/progress`
- **Learning Path**: `GET /api/learning-path`, `PUT /api/learning-path/step/:id`
- **Materials**: `GET /api/materials`, `POST /api/materials/upload`
- **Quizzes**: `GET /api/quizzes`, `GET /api/quizzes/:id`, `POST /api/quizzes/:id/submit`
- **Analytics**: `GET /api/analytics`
- **AI Advisor**: `POST /api/ai/advisor`
