import { prisma } from "../config/prisma.js";

beforeEach(async () => {
	await prisma.characterLocation.deleteMany();
	await prisma.gameSession.deleteMany();
	await prisma.leaderboardEntry.deleteMany();
	await prisma.character.deleteMany();
	await prisma.image.deleteMany();
});

afterAll(async () => {
	await prisma.$disconnect();
});
