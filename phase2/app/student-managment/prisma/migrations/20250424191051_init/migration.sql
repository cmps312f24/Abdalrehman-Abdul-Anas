-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Course" (
    "courseNo" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "credit" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "college" TEXT NOT NULL
);
INSERT INTO "new_Course" ("category", "college", "courseNo", "credit", "name") SELECT "category", "college", "courseNo", "credit", "name" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
