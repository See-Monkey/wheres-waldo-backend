import leaderboardService from "../services/leaderboardService.js";

async function getLeaderboard(req, res, next) {
	try {
		const imageId = req.params.imageId;

		const leaderboard = await leaderboardService.getTopTen(imageId);

		res.json(leaderboard);
	} catch (err) {
		next(err);
	}
}

async function submitEntry(req, res, next) {
	try {
		const imageId = req.params.imageId;
		const { sessionId, player } = req.body;

		await leaderboardService.submitEntry(imageId, sessionId, player);

		res.json({ message: "Leaderboard entry added" });
	} catch (err) {
		next(err);
	}
}

export default {
	getLeaderboard,
	submitEntry,
};
