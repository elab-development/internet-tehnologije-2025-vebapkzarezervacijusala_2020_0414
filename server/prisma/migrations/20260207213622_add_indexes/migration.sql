/*
  Warnings:

  - A unique constraint covering the columns `[buildingId,name]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX `Reservation_roomId_startTime_idx` ON `Reservation`(`roomId`, `startTime`);

-- CreateIndex
CREATE INDEX `Reservation_roomId_endTime_idx` ON `Reservation`(`roomId`, `endTime`);

-- CreateIndex
CREATE UNIQUE INDEX `Room_buildingId_name_key` ON `Room`(`buildingId`, `name`);

-- CreateIndex
CREATE INDEX `User_role_idx` ON `User`(`role`);

