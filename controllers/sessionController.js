import sessionService from "../services/sessionService.js";

async function startSession(req, res, next) {
	try {
		const imageId = req.params.imageId;

		const session = sessionService.startSession(imageId);

		res.json(session);
	} catch (err) {
		next(err);
	}
}

async function guess(req, res, next) {
	try {
		const session = await sessionService.getSession(req.params.sessionId);
		if (!session) {
			return res.status(404).json({ message: "Session not found" });
		}

		const { characterName, x, y } = req.body;

		const guessedCharacters = sessionService.guess(characterName, x, y);

		res.json(guessedCharacters);
	} catch (err) {
		next(err);
	}
}

export default {
	startSession,
	guess,
};
