/*
  Warnings:

  - You are about to drop the column `phone_number` on the `banned_users` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `verifications` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `wrong_verification_code_records` table. All the data in the column will be lost.
  - Added the required column `email` to the `banned_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `verifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `wrong_verification_code_records` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "banned_users" DROP COLUMN "phone_number",
ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "verifications" DROP COLUMN "phone_number",
ADD COLUMN     "email" VARCHAR(30) NOT NULL;

-- AlterTable
ALTER TABLE "wrong_verification_code_records" DROP COLUMN "phone_number",
ADD COLUMN     "email" TEXT NOT NULL;
