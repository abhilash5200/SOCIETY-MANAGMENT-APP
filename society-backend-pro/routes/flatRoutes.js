import express from "express";
import { createFlat, getAllFlats } from "../controllers/flatController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Admin Only */

router.post("/", verifyToken(["ADMIN"]), createFlat);
router.get("/", verifyToken(["ADMIN", "GUARD"]), getAllFlats);

export default router;