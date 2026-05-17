import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import http from "http";

import { Server } from "socket.io";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import flatRoutes from "./routes/flatRoutes.js";
import residentRoutes from "./routes/residentRoutes.js";
import visitorRoutes from "./routes/visitorRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import parkingRoutes from "./routes/parkingRoutes.js";
import emergencyRoutes from "./routes/emergencyRoutes.js";
import facilityRoutes from "./routes/facilityRoutes.js";
import pollRoutes from "./routes/pollRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";

dotenv.config();

const app = express();

connectDB();

/* ================= MIDDLEWARE ================= */

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

/* ================= HTTP SERVER ================= */

const server = http.createServer(app);

/* ================= SOCKET IO ================= */

export const io = new Server(server, {

  cors: {

    origin: "http://localhost:5173",

    methods: ["GET", "POST"]

  }

});

/* ================= SOCKET CONNECTION ================= */

io.on("connection", socket => {

  console.log(
    "⚡ User connected:",
    socket.id
  );

  socket.on("disconnect", () => {

    console.log(
      "❌ User disconnected:",
      socket.id
    );

  });

});

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);

app.use("/api/flats", flatRoutes);

app.use("/api/residents", residentRoutes);

app.use("/api/visitors", visitorRoutes);

app.use("/api/bills", billRoutes);

app.use("/api/deliveries", deliveryRoutes);

app.use("/api/complaints", complaintRoutes);

app.use("/api/staff", staffRoutes);

app.use("/api/notices", noticeRoutes);

app.use("/api/parking", parkingRoutes);

app.use("/api/emergencies", emergencyRoutes);

app.use("/api/facilities", facilityRoutes);

app.use("/api/polls", pollRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/audit", auditRoutes);

/* ================= HEALTH CHECK ================= */

app.get("/", (req, res) => {

  res.json({

    message:
      "Society Backend Pro Running 🚀"

  });

});

/* ================= SERVER ================= */

const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {

  console.log(
    `🚀 Server running on port ${PORT}`
  );

});