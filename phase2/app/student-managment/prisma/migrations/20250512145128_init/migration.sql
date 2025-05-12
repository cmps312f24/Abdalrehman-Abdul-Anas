/*
  Warnings:

  - You are about to drop the column `category` on the `Course` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Course" (
    "courseNo" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "credit" TEXT NOT NULL,
    "college" TEXT NOT NULL
);
INSERT INTO "new_Course" ("college", "courseNo", "credit", "name") SELECT "college", "courseNo", "credit", "name" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
