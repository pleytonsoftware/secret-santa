/*
  Warnings:

  - A unique constraint covering the columns `[viewToken]` on the table `assignments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "assignments" ADD COLUMN     "viewToken" TEXT;

-- AlterTable
ALTER TABLE "secret_santa_groups" ADD COLUMN     "additionalRules" TEXT,
ADD COLUMN     "exchangeDate" TIMESTAMP(3),
ADD COLUMN     "location" TEXT,
ADD COLUMN     "spendingLimit" TEXT,
ADD COLUMN     "theme" TEXT;

-- CreateTable
CREATE TABLE "wishlist_items" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "link" TEXT,
    "price" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assignments_viewToken_key" ON "assignments"("viewToken");

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
