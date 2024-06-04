-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "imgUrl" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;
