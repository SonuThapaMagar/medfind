/*
  Warnings:

  - You are about to drop the column `exp` on the `Medicine` table. All the data in the column will be lost.
  - You are about to drop the column `mfd` on the `Medicine` table. All the data in the column will be lost.
  - You are about to drop the `USER` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PharmacyOwner" DROP CONSTRAINT "PharmacyOwner_userId_fkey";

-- AlterTable
ALTER TABLE "Medicine" DROP COLUMN "exp",
DROP COLUMN "mfd";

-- DropTable
DROP TABLE "USER";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "PharmacyOwner" ADD CONSTRAINT "PharmacyOwner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
