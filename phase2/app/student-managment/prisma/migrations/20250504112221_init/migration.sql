/*
  Warnings:

  - The primary key for the `PathCourse` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PathCourse" (
    "pathName" TEXT NOT NULL,
    "courseNo" TEXT NOT NULL,
    "prerequests" TEXT,

    PRIMARY KEY ("pathName", "courseNo"),
    CONSTRAINT "PathCourse_pathName_fkey" FOREIGN KEY ("pathName") REFERENCES "Path" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PathCourse_courseNo_fkey" FOREIGN KEY ("courseNo") REFERENCES "Course" ("courseNo") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PathCourse" ("courseNo", "pathName", "prerequests") SELECT "courseNo", "pathName", "prerequests" FROM "PathCourse";
DROP TABLE "PathCourse";
ALTER TABLE "new_PathCourse" RENAME TO "PathCourse";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
