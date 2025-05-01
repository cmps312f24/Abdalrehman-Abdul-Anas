/*
  Warnings:

  - The primary key for the `login` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `login` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_login" (
    "email" TEXT NOT NULL PRIMARY KEY,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "adminId" TEXT,
    "instructorId" TEXT,
    "studentId" TEXT,
    CONSTRAINT "login_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "login_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "instructor" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "login_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_login" ("adminId", "email", "instructorId", "password", "role", "studentId") SELECT "adminId", "email", "instructorId", "password", "role", "studentId" FROM "login";
DROP TABLE "login";
ALTER TABLE "new_login" RENAME TO "login";
CREATE UNIQUE INDEX "login_adminId_key" ON "login"("adminId");
CREATE UNIQUE INDEX "login_instructorId_key" ON "login"("instructorId");
CREATE UNIQUE INDEX "login_studentId_key" ON "login"("studentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
