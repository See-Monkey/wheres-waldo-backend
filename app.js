import "./config/env.js";
import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";

const app = express();

// cross origin resource sharing
app.use(
	cors({
		origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : "*",
	}),
);

// parse JSON payload into req.body
app.use(express.json());

// Health check
app.get("/", (req, res) => {
	res.json({
		name: "Where's Waldo by See-Monkey",
		version: "1.0.0",
		status: "OK",
	});
});

// custom routers
app.use("/session", sessionRoutes);
app.use("/leaderboard", leaderboardRoutes);

// 404 for no routes found
app.use((req, res) => {
	res.status(404).json({ message: "Route not found" });
});

// catch middleware errors
app.use(errorHandler);

export default app;
