/*
  Warnings:

  - Added the required column `order` to the `PathCourse` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PathCourse" (
    "pathName" TEXT NOT NULL,
    "courseNo" TEXT NOT NULL,
    "prerequests" TEXT,
    "order" INTEGER NOT NULL,

    PRIMARY KEY ("pathName", "courseNo"),
    CONSTRAINT "PathCourse_pathName_fkey" FOREIGN KEY ("pathName") REFERENCES "Path" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PathCourse_courseNo_fkey" FOREIGN KEY ("courseNo") REFERENCES "Course" ("courseNo") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PathCourse" ("courseNo", "pathName", "prerequests") SELECT "courseNo", "pathName", "prerequests" FROM "PathCourse";
DROP TABLE "PathCourse";
ALTER TABLE "new_PathCourse" RENAME TO "PathCourse";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
