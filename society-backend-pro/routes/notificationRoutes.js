import express from "express";
import {
  getNotifications,
  markAsRead
} from "../controllers/notificationController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

import { createTestNotification } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", verifyToken(["ADMIN", "RESIDENT", "GUARD", "STAFF"]), getNotifications);

router.patch("/:id/read", verifyToken(["ADMIN", "RESIDENT", "GUARD", "STAFF"]), markAsRead);

router.post("/test", verifyToken(["ADMIN","RESIDENT","GUARD","STAFF"]), createTestNotification);

export default router;