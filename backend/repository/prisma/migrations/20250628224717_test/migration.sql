/*
  Warnings:

  - You are about to drop the column `questionId` on the `Window` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[windowId]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `windowId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Window" DROP CONSTRAINT "Window_questionId_fkey";

-- DropIndex
DROP INDEX "Window_questionId_key";

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "windowId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Window" DROP COLUMN "questionId";

-- CreateIndex
CREATE UNIQUE INDEX "Question_windowId_key" ON "Question"("windowId");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_windowId_fkey" FOREIGN KEY ("windowId") REFERENCES "Window"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
