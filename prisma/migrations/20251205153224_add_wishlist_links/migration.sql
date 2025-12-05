/*
  Warnings:

  - You are about to drop the column `link` on the `wishlist_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "wishlist_items" DROP COLUMN "link";

-- CreateTable
CREATE TABLE "wishlist_links" (
    "id" TEXT NOT NULL,
    "wishlistItemId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "storeName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishlist_links_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "wishlist_links" ADD CONSTRAINT "wishlist_links_wishlistItemId_fkey" FOREIGN KEY ("wishlistItemId") REFERENCES "wishlist_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
