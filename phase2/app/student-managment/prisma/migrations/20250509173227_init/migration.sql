/*
  Warnings:

  - The primary key for the `SectionInstructor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `SectionInstructor` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SectionInstructor" (
    "courseNo" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "instructorId" TEXT,
    "adminId" TEXT,
    "role" TEXT NOT NULL,

    PRIMARY KEY ("courseNo", "section"),
    CONSTRAINT "SectionInstructor_courseNo_section_fkey" FOREIGN KEY ("courseNo", "section") REFERENCES "Section" ("courseNo", "section") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SectionInstructor_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "instructor" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SectionInstructor_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_SectionInstructor" ("courseNo", "role", "section") SELECT "courseNo", "role", "section" FROM "SectionInstructor";
DROP TABLE "SectionInstructor";
ALTER TABLE "new_SectionInstructor" RENAME TO "SectionInstructor";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
