/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Sensor` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Sensor" DROP CONSTRAINT "Sensor_ownerId_fkey";

-- AlterTable
ALTER TABLE "Sensor" DROP COLUMN "ownerId";
