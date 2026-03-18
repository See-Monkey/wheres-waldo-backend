import sessionService from "../services/sessionService.js";

async function startSession(req, res, next) {
	try {
		const imageId = Number(req.params.imageId);

		const session = await sessionService.startSession(imageId);

		res.json(session);
	} catch (err) {
		next(err);
	}
}

async function guess(req, res, next) {
	try {
		const sessionId = req.params.sessionId;

		const { characterName, x, y } = req.body;

		const xNum = Number(x);
		const yNum = Number(y);

		if (!characterName || typeof x !== "number" || typeof y !== "number") {
			return res.status(400).json({ error: "Invalid input" });
		}

		const result = await sessionService.guess(sessionId, characterName, x, y);

		res.json(result);
	} catch (err) {
		next(err);
	}
}

export default {
	startSession,
	guess,
};
