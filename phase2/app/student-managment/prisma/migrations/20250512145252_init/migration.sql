/*
  Warnings:

  - Added the required column `category` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Section" (
    "courseNo" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "timing" TEXT NOT NULL,
    "dow" TEXT NOT NULL,
    "campus" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "instructorId" TEXT,
    "adminId" TEXT,

    PRIMARY KEY ("courseNo", "section"),
    CONSTRAINT "Section_courseNo_fkey" FOREIGN KEY ("courseNo") REFERENCES "Course" ("courseNo") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Section_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "instructor" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Section_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Section" ("adminId", "campus", "capacity", "courseNo", "dow", "instructorId", "place", "section", "status", "timing") SELECT "adminId", "campus", "capacity", "courseNo", "dow", "instructorId", "place", "section", "status", "timing" FROM "Section";
DROP TABLE "Section";
ALTER TABLE "new_Section" RENAME TO "Section";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
