import { Router } from "express";
import leaderboardController from "../controllers/leaderboardController.js";

const router = Router();

// Get leaderboard for an image
router.get("/:imageId", leaderboardController.getLeaderboard);

// Sumbit leaderboard entry
router.post("/:imageId", leaderboardController.submitEntry);

export default router;
