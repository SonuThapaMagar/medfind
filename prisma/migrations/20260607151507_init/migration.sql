/*
  Warnings:

  - You are about to drop the column `addresss` on the `Pharmacy` table. All the data in the column will be lost.
  - Added the required column `address` to the `Pharmacy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pharmacy" DROP COLUMN "addresss",
ADD COLUMN     "address" TEXT NOT NULL;
