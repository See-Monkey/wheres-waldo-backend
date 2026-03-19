import { prisma } from "../config/prisma.js";
import onTarget from "../functions/onTarget.js";

async function startSession(imageId) {
	const image = await prisma.image.findUnique({
		where: { id: imageId },
		include: {
			locations: {
				include: {
					character: true,
				},
			},
		},
	});

	if (!image) throw new Error("Image not found");

	const session = await prisma.gameSession.create({
		data: { imageId },
	});

	return {
		sessionId: session.id,
		characters: image.locations.map((l) => l.character.name),
	};
}

async function guess(sessionId, characterName, guessX, guessY) {
	const session = await prisma.gameSession.findUnique({
		where: { id: sessionId },
	});

	if (!session) throw new Error("Session not found");
	if (session.endTime) throw new Error("Session already completed");

	const location = await prisma.characterLocation.findFirst({
		where: {
			imageId: session.imageId,
			character: { name: characterName },
		},
		include: { character: true },
	});

	if (!location) throw new Error("Character not found for this image");

	const characterId = location.characterId;

	// Already guessed → just return current state
	if (session.guessedCharacters.includes(characterId)) {
		const guessedNames = await getGuessedNames(session.guessedCharacters);
		return {
			correct: false,
			guessedCharacters: guessedNames,
			completionTime: session.completionTime,
		};
	}

	const hit = onTarget(guessX, guessY, location.x, location.y);

	if (!hit) {
		const guessedNames = await getGuessedNames(session.guessedCharacters);
		return {
			correct: false,
			guessedCharacters: guessedNames,
			completionTime: session.completionTime,
		};
	}

	const updatedGuesses = [
		...new Set([...session.guessedCharacters, characterId]),
	];

	// check completion
	const totalCharacters = await prisma.characterLocation.count({
		where: { imageId: session.imageId },
	});

	let updatedSession;

	if (updatedGuesses.length === totalCharacters) {
		const endTime = new Date();
		const completionTime = (endTime - new Date(session.startTime)) / 1000;

		updatedSession = await prisma.gameSession.update({
			where: { id: sessionId },
			data: {
				guessedCharacters: updatedGuesses,
				endTime,
				completionTime,
			},
		});
	} else {
		updatedSession = await prisma.gameSession.update({
			where: { id: sessionId },
			data: { guessedCharacters: updatedGuesses },
		});
	}

	const guessedNames = await getGuessedNames(updatedGuesses);

	return {
		correct: true,
		guessedCharacters: guessedNames,
		completionTime: updatedSession.completionTime ?? null,
	};
}

// helper
async function getGuessedNames(characterIds) {
	if (!characterIds.length) return [];

	const chars = await prisma.character.findMany({
		where: { id: { in: characterIds } },
	});

	return chars.map((c) => c.name);
}

export default {
	startSession,
	guess,
};
