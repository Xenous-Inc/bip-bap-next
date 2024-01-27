/*
  Warnings:

  - Added the required column `type` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "type" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Location" (
    "type" TEXT NOT NULL,
    "coordinates" DOUBLE PRECISION[]
);

-- CreateTable
CREATE TABLE "Param" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "fieldSensors" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL,
    "sensorId" INTEGER,

    CONSTRAINT "Param_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sensor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "model" INTEGER NOT NULL,
    "version" DOUBLE PRECISION NOT NULL,
    "firmwareVersion" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "approvedBySensor" BOOLEAN NOT NULL,
    "owner" TEXT NOT NULL,
    "settings" TEXT NOT NULL,
    "locationCoordinates" DOUBLE PRECISION[],

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SensorToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_coordinates_key" ON "Location"("coordinates");

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_name_key" ON "Sensor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_locationCoordinates_key" ON "Sensor"("locationCoordinates");

-- CreateIndex
CREATE UNIQUE INDEX "_SensorToUser_AB_unique" ON "_SensorToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SensorToUser_B_index" ON "_SensorToUser"("B");

-- AddForeignKey
ALTER TABLE "Param" ADD CONSTRAINT "Param_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_locationCoordinates_fkey" FOREIGN KEY ("locationCoordinates") REFERENCES "Location"("coordinates") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SensorToUser" ADD CONSTRAINT "_SensorToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Sensor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SensorToUser" ADD CONSTRAINT "_SensorToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
