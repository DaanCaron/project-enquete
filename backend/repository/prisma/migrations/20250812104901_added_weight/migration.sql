/*
  Warnings:

  - Changed the type of `weight` on the `Answer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "weight",
ADD COLUMN     "weight" INTEGER NOT NULL;
