/*
  Warnings:

  - Added the required column `campus` to the `Section` table without a default value. This is not possible if the table is not empty.
  - Added the required column `capacity` to the `Section` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dow` to the `Section` table without a default value. This is not possible if the table is not empty.
  - Added the required column `place` to the `Section` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Section` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timing` to the `Section` table without a default value. This is not possible if the table is not empty.

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

    PRIMARY KEY ("courseNo", "section"),
    CONSTRAINT "Section_courseNo_fkey" FOREIGN KEY ("courseNo") REFERENCES "Course" ("courseNo") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Section" ("courseNo", "section") SELECT "courseNo", "section" FROM "Section";
DROP TABLE "Section";
ALTER TABLE "new_Section" RENAME TO "Section";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
