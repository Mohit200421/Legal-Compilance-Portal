# ⚖️ LawSetu – Legal Compliance Portal

LawSetu is a full-stack **Legal Compliance & Lawyer-Client Portal** built using the **MERN Stack**.
It provides a secure platform where **users can connect with lawyers**, send requests, chat in real-time, upload documents, run OCR, and manage legal services efficiently.

---

## 🚀 Features

### ✅ Authentication & Security

* User / Lawyer / Admin roles
* Secure Login & Register
* **Email OTP Verification**
* Forgot Password with OTP
* JWT Session stored in **HTTP-Only Cookie**
* Protected Routes (Role Based Access)

---

### 👤 User Module

* Register/Login with OTP verification
* Browse lawyers with filters (location, specialization)
* Send request to lawyer
* Track request status (Pending / Accepted / Rejected)
* Real-time chat with accepted lawyer
* View uploaded documents
* Articles / Jobs / Events access
* Discussion forum

---

### 👨‍⚖️ Lawyer Module

* Lawyer Dashboard (stats + upcoming case events)
* Manage requests (Accept / Reject)
* Real-time chat with users
* Upload & assign documents to users
* OCR extraction on documents
* Articles / Discussion / Case management

---

### 🛡️ Admin Module

* Admin Dashboard with counts
* Manage Users (Activate / Deactivate / Delete)
* Manage Lawyers
* **Pending Lawyer Approval System**
* Master Data Management (City / State / Category)
* Manage News / Events / Jobs
* Auto Reminder Emails using Cron

---

### 📄 Document + OCR Module

* Upload documents (Lawyer → Assign to User)
* View / Download documents
* OCR Extraction (Text extraction)
* OCR Text View Modal

---

### 💬 Real-Time Chat System

* Socket.io based chat
* Join rooms by userId
* Instant message delivery
* Chat modal interface

---

## 🧑‍💻 Tech Stack

### Frontend

* React.js (Vite)
* React Router DOM
* Axios
* Socket.io Client
* CSS Modules / Custom CSS

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Nodemailer (OTP emails)
* Multer (File Upload)
* Socket.io (Real-time Chat)
* Cron Jobs (Event Reminder Emails)

---

## 📁 Project Structure

```
Legal-Compliance-Portal/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── styles/
│   │   └── App.jsx
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### ✅ 1. Clone the Repository

```bash
git clone https://github.com/Mohit200421/Legal-Compilance-Portal.git
cd Legal-Compliance-Portal
```

---

### ✅ 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
NODE_ENV=development
```

Run backend:

```bash
npm start
```

Backend will run on:
👉 `http://localhost:5000`

---

### ✅ 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend will run on:
👉 `http://localhost:5173`

---

## 🔐 OTP Email Setup (Gmail)

To make OTP emails work:

1. Enable **2-Step Verification** in Gmail
2. Generate **App Password**
3. Use that app password in `.env`

---

## 📸 Screens / Modules Included

* Admin Panel
* Lawyer Panel
* User Panel
* OTP Verification Page
* Real-time Chat Modal
* Documents & OCR Module
* Requests System
* Discussion Forum

---

## 🔥 Future Enhancements

* Lawyer profile edit (photo, specialization, about)
* Payment integration for consultation (Razorpay)
* Notifications system
* Video call integration
* Admin analytics charts

---

## 👨‍💻 Author

**Mohit Badgujar**
📌 Final Year BE Computer Engineering Student
🚀 MERN Stack Developer

---
