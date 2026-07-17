#  LegalSetu – Legal Compliance & Lawyer Consultation Portal

LegalSetu is a full-stack MERN web application developed as my final year engineering project. The main goal of this project is to make legal services more accessible by allowing users to find lawyers, book consultations, manage legal documents, and communicate securely through a single platform.

The application also provides separate dashboards for Users, Lawyers, and Admins with role-based access and real-time communication features.

Live :- https://legal-compilance-portal.vercel.app
---

## Project Overview

LegalSetu helps connect people with verified lawyers while simplifying legal document management and consultation.

Some of the main features include:

* User registration and secure login
* Role-based authentication (User, Lawyer, Admin)
* Lawyer search using location and practice area
* Consultation request management
* Real-time chat
* Document upload with OCR text extraction
* Online payment integration
* Subscription management
* Admin panel for managing users and lawyers

---

## Technologies Used

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Axios
* Socket.io Client

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt
* Socket.io
* Multer
* Cloudinary
* Razorpay
* Nodemailer
* Tesseract.js

---

## Project Structure

```
Legal-Compilance-Portal-main
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   ├── cron
│   └── server.js
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── routes
│   │   └── App.jsx
│
├── README.md
└── TODO.md
```

---

## Main Features

### User

* Register and login securely
* Search lawyers by city and specialization
* Send consultation requests
* Upload legal documents
* Chat with lawyers
* View case updates

### Lawyer

* Manage profile
* Accept or reject consultation requests
* Handle assigned cases
* Chat with clients
* Conduct video consultations
* View earnings

### Admin

* Manage users
* Approve lawyer registrations
* Manage categories and cities
* View platform statistics
* Moderate content

---

## Installation

### Clone Repository

```bash
git clone <repository-url>

cd Legal-Compilance-Portal-main
```

### Backend Setup

```bash
cd backend

npm install

npm run dev
```

Create a `.env` file and add the required environment variables.

Example:

```
PORT=5000
MONGO_URI=
JWT_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

Backend runs on:

```
http://localhost:5000
```

---

## Sample Modules

### Authentication

* JWT Authentication
* Email OTP Verification
* Forgot Password
* Role-based Authorization

### Communication

* Real-time Chat
* Video Calling
* Email Notifications

### Document Management

* File Upload
* OCR Text Extraction
* Secure Document Storage

### Payments

* Razorpay Payment Gateway
* Subscription Handling

---

## Future Improvements

Some features that can be added in future versions:

* Mobile application
* Push notifications
* AI-based legal assistant
* Better analytics dashboard
* Multi-language support

---

## Learning Outcomes

During this project I gained practical experience in:

* Building REST APIs
* MERN Stack Development
* JWT Authentication
* Role-Based Access Control
* MongoDB Database Design
* Real-time communication using Socket.io
* Cloudinary Integration
* OCR using Tesseract.js
* Payment Gateway Integration
* Project Deployment

---

## Author

**Mohit Badgujar**

Final Year B.E. Computer Engineering Student

---

## License

This project is developed for educational purposes as a final year engineering project.
