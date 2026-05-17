import express from "express";
import { getAuditLogs } from "../controllers/auditController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Admin only */

router.get("/", verifyToken(["ADMIN"]), getAuditLogs);

export default router;