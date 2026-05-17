import express from "express";
import {
  createNotice,
  getNotices,
  deleteNotice
} from "../controllers/noticeController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Admin only */

router.post("/", verifyToken(["ADMIN"]), createNotice);
router.delete("/:id", verifyToken(["ADMIN"]), deleteNotice);

/* All users can view */

router.get("/", verifyToken(["ADMIN", "RESIDENT", "GUARD", "STAFF"]), getNotices);

export default router;