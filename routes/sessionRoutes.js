import { Router } from "express";
import sessionController from "../controllers/sessionController.js";

const router = Router();

// Start a new session
router.post("/:imageId", sessionController.startSession);

// Guess a character location
router.post("/:sessionId/guess", sessionController.guess);

export default router;
