import express from "express";
import {
  createPoll,
  votePoll,
  getPolls
} from "../controllers/pollController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Admin creates poll */

router.post("/", verifyToken(["ADMIN"]), createPoll);

/* Residents vote */

router.patch("/:id/vote", verifyToken(["RESIDENT"]), votePoll);

/* Everyone views polls */

router.get("/", verifyToken(["ADMIN", "RESIDENT"]), getPolls);

export default router;