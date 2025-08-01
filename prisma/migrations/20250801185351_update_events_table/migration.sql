/*
  Warnings:

  - You are about to drop the column `configuration` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "configuration",
ADD COLUMN     "link" TEXT;
