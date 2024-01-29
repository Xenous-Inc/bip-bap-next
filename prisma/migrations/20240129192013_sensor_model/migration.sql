/*
  Warnings:

  - You are about to drop the column `locationCoordinates` on the `Sensor` table. All the data in the column will be lost.
  - You are about to drop the column `owner` on the `Sensor` table. All the data in the column will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Param` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `type` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'USER', 'GUEST');

-- CreateEnum
CREATE TYPE "SensorDataType" AS ENUM ('PM10', 'PM25', 'OZON');

-- DropForeignKey
ALTER TABLE "Param" DROP CONSTRAINT "Param_sensorId_fkey";

-- DropForeignKey
ALTER TABLE "Sensor" DROP CONSTRAINT "Sensor_locationCoordinates_fkey";

-- DropIndex
DROP INDEX "Sensor_locationCoordinates_key";

-- AlterTable
ALTER TABLE "Sensor" DROP COLUMN "locationCoordinates",
DROP COLUMN "owner",
ADD COLUMN     "coordinates" DOUBLE PRECISION[],
ADD COLUMN     "sensorDataId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "type",
ADD COLUMN     "type" "UserType" NOT NULL;

-- DropTable
DROP TABLE "Location";

-- DropTable
DROP TABLE "Param";

-- CreateTable
CREATE TABLE "SensorData" (
    "id" SERIAL NOT NULL,
    "type" "SensorDataType" NOT NULL,
    "value" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL,

    CONSTRAINT "SensorData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_sensorDataId_fkey" FOREIGN KEY ("sensorDataId") REFERENCES "SensorData"("id") ON DELETE SET NULL ON UPDATE CASCADE;
