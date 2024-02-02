/*
  Warnings:

  - The primary key for the `Sensor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `approvedBySensor` on the `Sensor` table. All the data in the column will be lost.
  - You are about to drop the column `sensorDataId` on the `Sensor` table. All the data in the column will be lost.
  - You are about to drop the column `settings` on the `Sensor` table. All the data in the column will be lost.
  - The primary key for the `SensorData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `_SensorToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ownerId` to the `Sensor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sensorId` to the `SensorData` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Sensor" DROP CONSTRAINT "Sensor_sensorDataId_fkey";

-- DropForeignKey
ALTER TABLE "_SensorToUser" DROP CONSTRAINT "_SensorToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_SensorToUser" DROP CONSTRAINT "_SensorToUser_B_fkey";

-- AlterTable
ALTER TABLE "Sensor" DROP CONSTRAINT "Sensor_pkey",
DROP COLUMN "approvedBySensor",
DROP COLUMN "sensorDataId",
DROP COLUMN "settings",
ADD COLUMN     "ownerId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Sensor_id_seq";

-- AlterTable
ALTER TABLE "SensorData" DROP CONSTRAINT "SensorData_pkey",
ADD COLUMN     "sensorId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "value" SET DATA TYPE DOUBLE PRECISION,
ADD CONSTRAINT "SensorData_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SensorData_id_seq";

-- DropTable
DROP TABLE "_SensorToUser";

-- AddForeignKey
ALTER TABLE "SensorData" ADD CONSTRAINT "SensorData_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
