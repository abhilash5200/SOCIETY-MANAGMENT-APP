# 🏢 Society Management System Pro

A full-stack MERN-based Society Management ERP platform designed to simplify residential community operations with role-based dashboards, realtime communication, complaint tracking, visitor management, billing, parking management, and more.

---

# 🚀 Project Overview

Society Management System Pro is a multi-role enterprise-style web application built for apartment communities and gated societies.

The platform helps:

* Admins manage society operations
* Residents raise complaints and view notices
* Guards manage visitor entries
* Staff resolve maintenance complaints

The project includes modern dashboards, realtime updates using Socket.IO, protected routing, authentication, and responsive UI.

---

# ✨ Key Features

## 🔐 Authentication & Authorization

* JWT Authentication
* Secure Login & Registration
* Role-Based Access Control (RBAC)
* Protected Routes
* Persistent Sessions using Zustand + Session Storage

---

# 👨‍💼 Admin Module

Admin can:

* Manage residents
* Manage flats
* Manage parking slots
* Create maintenance bills
* Manage complaints
* Assign complaints to staff
* Create and delete notices
* View visitor records
* View dashboard analytics

---

# 🏠 Resident Module

Residents can:

* View dashboard
* Raise complaints
* Track complaint status
* View notices
* View bills
* View assigned parking slots
* Approve/reject visitors
* Manage profile

---

# 🛡️ Guard Module

Guards can:

* Register visitors
* View visitor requests
* Check visitor approvals
* Manage visitor entry/exit

---

# 🧰 Staff Module

Staff members can:

* View assigned complaints
* Resolve complaints
* Track maintenance tasks

---

# ⚡ Realtime Features

Implemented using Socket.IO:

* Live complaint updates
* Realtime notice broadcasting
* Instant dashboard refresh
* Toast notifications
* Live synchronization across users

---

# 🎨 UI Features

* Fully responsive design
* Modern dashboard layout
* Role-specific sidebars
* Professional card-based UI
* Toast notifications
* Tailwind CSS styling
* Lucide React icons

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Zustand
* Axios
* Socket.IO Client
* React Hot Toast
* Lucide React

---

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Bcrypt
* Socket.IO
* Helmet
* Morgan
* CORS

---

# 🗂️ Project Structure

```bash
society-management-system/
│
├── society-frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── socket/
│   │   ├── store/
│   │   └── App.jsx
│
├── society-backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
│
└── README.md
```

---

# ⚙️ Installation Guide

# 1️⃣ Clone Repository

```bash
git clone <your-repository-url>
```

---

# 2️⃣ Install Frontend Dependencies

```bash
cd society-frontend
npm install
```

---

# 3️⃣ Install Backend Dependencies

```bash
cd society-backend
npm install
```

---

# 4️⃣ Setup Environment Variables

Create `.env` file inside backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

# 5️⃣ Start Backend Server

```bash
npm run dev
```

---

# 6️⃣ Start Frontend Server

```bash
npm run dev
```

---

# 🌐 Default URLs

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

---

# 👥 Demo Roles

## 👨‍💼 Admin

```text
Role: ADMIN
```

## 🏠 Resident

```text
Role: RESIDENT
```

## 🛡️ Guard

```text
Role: GUARD
```

## 🧰 Staff

```text
Role: STAFF
```

---

# 🔒 Security Features

* Password hashing using bcrypt
* JWT token authentication
* Role-based authorization
* Protected backend APIs
* Secure route handling
* Helmet middleware security

---

# 🏢 Facility Booking Module

The Society Management System Pro includes a complete Facility Booking Management system that allows administrators to create and manage society facilities while enabling residents to reserve available facilities.

## 👨‍💼 Admin Facility Management

Admins can:

* Create new facilities
* Set facility type (FREE or PAID)
* Define facility pricing
* Configure custom time slots
* Set slot capacities
* Activate or deactivate facilities
* View all facility bookings
* Track facility revenue
* Monitor facility usage statistics
* View resident booking history

### Facility Types

#### FREE Facilities

Examples:

* Library
* Reading Room
* Community Hall (Free Access)
* Indoor Games Room

Rules:

* Residents can maintain only one active booking at a time for the same free facility.
* Duplicate bookings are prevented.
* Slot availability is automatically validated.

#### PAID Facilities

Examples:

* Party Hall
* Guest Room
* Club House
* Premium Sports Court

Features:

* Multiple bookings allowed.
* Payment tracking supported.
* Revenue analytics maintained.
* Booking history recorded.

---

## 🏠 Resident Facility Booking

Residents can:

* Browse available facilities
* View facility details
* Check facility location
* View facility type (FREE / PAID)
* View pricing information
* Select available dates
* Choose available time slots
* Book facilities
* Pay for premium facilities
* View booking history
* Cancel bookings

---

## ⏰ Slot-Based Booking System

Each facility supports custom administrator-defined slots.

Example:

09:00 AM – 10:00 AM

10:00 AM – 11:00 AM

11:00 AM – 12:00 PM

Features:

* Capacity management per slot
* Duplicate booking prevention
* Availability validation
* Real-time slot tracking

---

## 💳 Payment Management

Supported Payment Methods:

* UPI
* Card
* Cash
* Bank Transfer
* Digital Wallet

Payment Tracking:

* Pending
* Paid
* Failed
* Refunded

---

## 📊 Facility Analytics

Administrators can monitor:

* Total bookings
* Active bookings
* Cancelled bookings
* Facility revenue
* Facility utilization
* Resident booking statistics

---

## 🔐 Booking Rules

* Residents cannot book unavailable slots.
* Duplicate bookings are prevented.
* Free facilities restrict active duplicate bookings.
* Paid facilities support multiple bookings.
* Slot capacity limits are enforced.
* Only authenticated users can create bookings.
* Admins can view all bookings.
* Residents can only manage their own bookings.


# 📦 Main Functional Modules

| Module         | Description                |
| -------------- | -------------------------- |
| Authentication | Login/Register/JWT         |
| Residents      | Resident management        |
| Flats          | Flat allocation            |
| Complaints     | Raise & resolve complaints |
| Visitors       | Visitor approval system    |
| Billing        | Maintenance billing        |
| Notices        | Society announcements      |
| Parking        | Slot management            |
| Staff          | Maintenance operations     |
| Dashboard      | Analytics overview         |

---

# 📱 Responsive Design

The application is optimized for:

* Desktop
* Tablet
* Mobile devices

---

# 🚀 Future Enhancements

Planned improvements:

* Notification center
* File uploads
* Email alerts
* Dark mode
* Charts & analytics
* Payment gateway integration
* Mobile app support

---

# 🎓 Academic Purpose

This project was developed as a full-stack MERN academic project to demonstrate:

* Full-stack web development
* Realtime communication
* Enterprise dashboard architecture
* Authentication & authorization
* REST API development
* Responsive UI/UX design

---

# 📸 Screenshots

Add screenshots here:

* Admin Dashboard
* Resident Dashboard
* Guard Panel
* Staff Dashboard
* Complaint Module
* Visitor Module

---

# 🙌 Conclusion

Society Management System Pro is a complete modern ERP-style residential management platform built using the MERN stack with realtime functionality and role-based architecture.

The project demonstrates practical implementation of enterprise application concepts including authentication, authorization, realtime systems, modular architecture, and responsive frontend development.

---

# 👨‍💻 Developed By

BADDIPALLY ABHILASH REDDY
