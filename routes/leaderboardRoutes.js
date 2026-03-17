import { Router } from "express";
import leaderboardController from "../controllers/leaderboardController.js";

const router = Router();

// Get leaderboard for an image
router.get("/:imageId", leaderboardController.getTopTen);

// Sumbit leaderboard entry
router.get("/:imageId", leaderboardController.submitEntry);

export default router;
