import { prisma } from "../config/prisma.js";

async function getTopTen(imageId) {
	return prisma.leaderboardEntry.findMany({
		where: { imageId },
		orderBy: {
			completionTime: "asc",
		},
		take: 10,
		select: {
			player: true,
			completionTime: true,
			createdAt: true,
		},
	});
}

async function submitEntry(imageId, sessionId, player) {
	const session = await prisma.gameSession.findUnique({
		where: { id: sessionId },
	});

	if (!session) throw new Error("Session not found");
	if (!session.completionTime) {
		throw new Error("Session not completed");
	}

	if (session.imageId !== imageId) {
		throw new Error("Session does not match image");
	}

	// Get current worst time in top 10
	const topTen = await prisma.leaderboardEntry.findMany({
		where: { imageId },
		orderBy: { completionTime: "asc" },
		take: 10,
	});

	const qualifies =
		topTen.length < 10 ||
		session.completionTime < topTen[topTen.length - 1].completionTime;

	if (!qualifies) {
		throw new Error("Score does not qualify for leaderboard");
	}

	await prisma.leaderboardEntry.create({
		data: {
			imageId,
			sessionId,
			player,
			completionTime: session.completionTime,
		},
	});

	// Trim to 10
	await prisma.leaderboardEntry.deleteMany({
		where: {
			imageId,
			id: {
				notIn: (
					await prisma.leaderboardEntry.findMany({
						where: { imageId },
						orderBy: { completionTime: "asc" },
						take: 10,
						select: { id: true },
					})
				).map((e) => e.id),
			},
		},
	});
}

export default {
	getTopTen,
	submitEntry,
};
