/*
  Warnings:

  - You are about to drop the column `user_id` on the `event_speakers` table. All the data in the column will be lost.
  - Added the required column `family` to the `event_speakers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `event_speakers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "event_speakers" DROP CONSTRAINT "event_speakers_user_id_fkey";

-- AlterTable
ALTER TABLE "event_speakers" DROP COLUMN "user_id",
ADD COLUMN     "family" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
