# LegalSetu – Legal Compliance & Lawyer Consultation Portal

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Backend](https://img.shields.io/badge/Backend-Node_Express-MongoDB-brightgreen)](https://nodejs.org/)
[![Frontend](https://img.shields.io/badge/Frontend-React_Vite-Tailwind-blue)](https://reactjs.org/)
[![Real-time](https://img.shields.io/badge/Real--time-Socket.io-orange)](https://socket.io/)

**LegalSetu** is a production-ready **full-stack MERN platform** for legal compliance, lawyer discovery, consultations, and case management. Users connect with verified lawyers via chat/video calls, upload documents for OCR analysis, manage payments/subscriptions, and track cases – all in a secure, role-based system.

## Key Features

| Module               | Features                                                                                                                |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Authentication**   | JWT (HTTP-only cookies), Email OTP, Forgot Password, Role-based access (User/Lawyer/Admin)                              |
| **User Dashboard**   | Browse lawyers (filters: location/practice), Send requests, Real-time chat, Documents/OCR, Cases, Articles, Discussions |
| **Lawyer Dashboard** | Profile management, Client requests, Chat/Video calls, Case events, Document assignment/OCR, Earnings                   |
| **Admin Dashboard**  | User/Lawyer management (approval/activation), Analytics, Master data (cities/categories), Content moderation            |
| **Payments**         | Razorpay integration, Fixed payments, Subscriptions (cron expiry checks)                                                |
| **Communications**   | Socket.io chat (room-based), P2P Video calls (SimplePeer), Email reminders (Nodemailer)                                 |
| **Documents**        | Multer/Cloudinary uploads, Tesseract.js OCR extraction, Secure sharing                                                  |
| **Automation**       | Cron jobs (event reminders, subscription expiry), Winston logging                                                       |
| **AI/Extras**        | AI Chat routes, Job board, News/Events/Feedback                                                                         |

## Tech Stack

### Backend

- **Runtime**: Node.js, Express.js
- **Database**: MongoDB + Mongoose (models: User, Lawyer, Case, Payment, Message, Document, etc.)
- **Auth/Security**: JWT, bcrypt, roleMiddleware, checkSubscription
- **Services**: Razorpay, Cloudinary, Tesseract.js (OCR), Nodemailer, Socket.io, node-cron
- **Utils**: Multer, Winston logger, emailService, ocrHelper, reminderEngine

### Frontend

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS 3.4, clsx, Tailwind Merge
- **UI/UX**: Lucide React icons, Framer Motion, React Hot Toast, shadcn/ui primitives
- **State/Routing**: React Context (Auth/Call), React Router 6
- **Real-time**: Socket.io-client, SimplePeer (video)
- **Other**: Axios, QRCode.react, jwt-decode

## Project Structure

```
Legal-Compilance-Portal-main/
├── backend/
│   ├── config/          # DB, Cloudinary, Razorpay, Multer
│   ├── controllers/     # 15+ controllers (auth, lawyer, payment, ocr...)
│   ├── middleware/      # Auth, role, subscription checks
│   ├── models/          # 20+ schemas (User, Lawyer, CaseEvent...)
│   ├── routes/          # Modular routes (adminRoutes, paymentRoutes...)
│   ├── utils/           # emailService, logger, ocrHelper...
│   ├── cron/            # Event reminders, subscription expiry
│   ├── uploads/         # Documents/lawyers (Cloudinary CDN)
│   └── server.js        # Entry point + Socket handler
├── frontend/
│   ├── public/          # Assets (logo, icons)
│   ├── src/
│   │   ├── api/         # Axios wrappers (lawyerApi, socket)
│   │   ├── components/  # LawyerCard, VideoCall, ChatModal, FilterSidebar...
│   │   ├── context/     # AuthContext, CallContext
│   │   ├── pages/       # Role layouts + Home/About/Auth...
│   │   ├── routes/      # ProtectedRoute, AdminRoute
│   │   └── App.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
├── README.md            # This file!
└── TODO.md              # Active tasks
```

## Quick Start

### Prerequisites

- Node.js 20+
- MongoDB (Atlas or local)
- Gmail App Password (for OTP)
- Razorpay test keys
- Cloudinary credentials

### 1. Clone & Install

```bash
git clone <repo-url>
cd Legal-Compilance-Portal-main
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Create & fill .env
npm run seed  # Optional: seedStates.js, seedCitiesSample.js
npm run dev   # or npm start
```

**Backend**: `http://localhost:5000`

**.env template**:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/LegalSetu
JWT_SECRET=your-super-secret-jwt-key
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
EMAIL_USER=your@gmail.com
EMAIL_PASS=your-app-password
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

**Frontend**: `http://localhost:5173`

## API Examples (Postman/Swagger ready)

- `POST /api/auth/register` – User signup
- `GET /api/lawyers?city=Delhi&category=Divorce` – Filtered lawyers
- `POST /api/payment/create` – Razorpay order
- `GET /api/chat/messages/:userId` – Chat history
- `POST /api/ocr/extract` – Document text extraction

## Key Pages/Screens

- **Public**: Home, Lawyer Listing, About, Privacy
- **User**: Dashboard, MyRequests, TalkToLawyer, Documents, Discussion
- **Lawyer**: Dashboard, Profile (detailed: services/reviews/location), Cases, Requests
- **Admin**: Dashboard, ManageUsers, PendingLawyers, AddLawyer
- **Shared**: ChatModal, VideoCall, ApplyLawyer, VerifyOtp

## Testing & Deployment

- **Local**: Backend dev server with nodemon, Frontend hot reload
- **Deploy**:
  - Frontend: Vercel/Netlify (`npm run build`)
  - Backend: Render/Heroku (with MongoDB Atlas)
- **Seed Data**: `backend/scripts/seed*` for states/cities/plans

## TODO & Future Plans

See [TODO.md](./TODO.md)

- Video call polish
- Push notifications
- Lawyer verification badges
- Analytics dashboard
- Mobile app (React Native?)

## Contributing

1. Fork & PR
2. Follow ESLint/Tailwind conventions
3. Update tests (add Jest?)

## License & Author

MIT License – **Mohit Badgujar** (MERN Developer)
