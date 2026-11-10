# PLAN-SMART-P1-BACKEND

A backend service for an **AI-powered interview management system**. It manages users, jobs, job applications, and conducts AI-driven mock interviews with automated question generation and review using Google Gemini.

## Live Links
- Frontend: https://future-vision-m5nk.onrender.com
- Backend: https://vision-backend-15ip.onrender.com

## Features
- User authentication (register, login, logout) using JWT + secure cookies
- Email verification and password reset via OTP (Nodemailer)
- User profile management with avatar and CV upload (Multer + Cloudinary)
- Admin authentication and job posting
- Job listing, application, and tracking
- AI mock interviews powered by Google Gemini:
  - Automatic interview question generation
  - Real-time conversation-based interview flow
  - AI-generated performance review on completion
- Role-based access control (admin / user middleware)

## Tech Stack
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT, bcryptjs, cookie-parser
- **AI:** Google Gemini (`@google/genai`, `ai`, `@ai-sdk/google`)
- **File Uploads:** Multer, Cloudinary
- **Email:** Nodemailer
- **Validation:** Zod
- **Deployment:** Docker + Render

## Project Structure
```
├── config/        # MongoDB, Cloudinary, Nodemailer setup
├── controllers/   # Request handlers (auth, user, admin, jobs)
├── middleware/    # Auth guards (userAuth, adminAuth)
├── models/        # Mongoose schemas (user, job, interview, etc.)
├── routes/        # API route definitions
├── services/      # Business logic and AI services
├── index.js       # App entry point
├── Dockerfile
└── package.json
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/send-verify-otp` | Send email verification OTP |
| POST | `/api/auth/verify-account` | Verify email |
| POST | `/api/auth/send-reset-otp` | Send password reset OTP |
| POST | `/api/auth/reset-password` | Reset password |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/data` | Get logged-in user data |
| GET | `/api/user/get-profile` | Get user profile |
| POST | `/api/user/set-profile` | Update profile |
| POST | `/api/user/set-profile-pic` | Upload avatar |
| POST | `/api/user/set-cv` | Upload CV |

### Jobs & Interviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/job/get-all-job-profile` | List all jobs |
| POST | `/api/user/job/set-job-application` | Apply for a job |
| GET | `/api/user/job/get-applied-jobs` | Get applied jobs |
| GET | `/api/user/job/get-pending-interviews` | Get pending interviews |
| POST | `/api/user/job/start-interview` | Start an interview |
| POST | `/api/user/job/end-interview` | End an interview |
| GET | `/api/user/job/get-completed-interviews` | Get completed interviews |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/vision/admin/login` | Admin login |
| POST | `/api/vision/admin/set-new-job` | Create a new job |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB database
- Google Gemini API key
- Cloudinary account

### Installation
```bash
git clone <repo-url>
cd PLAN-SMART-P1-BACKEND
npm install
```

### Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_email_password
```

### Run
```bash
npm install
npm start       # production
npm run dev     # development (watch mode)
npm run server  # development (nodemon)
```

Server runs at `http://localhost:3000`.

## Docker
```bash
docker build -t plan-smart-backend .
docker run -p 3000:3000 --env-file .env plan-smart-backend
```
