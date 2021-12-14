/*
  Warnings:

  - You are about to drop the column `hashedTy` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `hashedTy`,
    ADD COLUMN `hashedRt` VARCHAR(191) NULL;
