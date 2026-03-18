-- AlterTable
ALTER TABLE "GameSession" ADD COLUMN     "guessedCharacters" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
