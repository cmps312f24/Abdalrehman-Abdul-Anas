/*
  Warnings:

  - The primary key for the `Enrollment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `GPARecord` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SectionInstructor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `instructor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `login` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Enrollment" (
    "studentId" TEXT NOT NULL,
    "courseNo" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "grade" TEXT,

    PRIMARY KEY ("studentId", "courseNo", "section"),
    CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Enrollment_courseNo_section_fkey" FOREIGN KEY ("courseNo", "section") REFERENCES "Section" ("courseNo", "section") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Enrollment" ("courseNo", "grade", "section", "status", "studentId") SELECT "courseNo", "grade", "section", "status", "studentId" FROM "Enrollment";
DROP TABLE "Enrollment";
ALTER TABLE "new_Enrollment" RENAME TO "Enrollment";
CREATE TABLE "new_GPARecord" (
    "ch" TEXT NOT NULL,
    "gpa" REAL NOT NULL,
    "studentId" TEXT NOT NULL,

    PRIMARY KEY ("studentId", "ch"),
    CONSTRAINT "GPARecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_GPARecord" ("ch", "gpa", "studentId") SELECT "ch", "gpa", "studentId" FROM "GPARecord";
DROP TABLE "GPARecord";
ALTER TABLE "new_GPARecord" RENAME TO "GPARecord";
CREATE TABLE "new_SectionInstructor" (
    "courseNo" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    PRIMARY KEY ("userId", "courseNo", "section"),
    CONSTRAINT "SectionInstructor_courseNo_section_fkey" FOREIGN KEY ("courseNo", "section") REFERENCES "Section" ("courseNo", "section") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SectionInstructor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "admin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SectionInstructor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "instructor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SectionInstructor" ("courseNo", "role", "section", "userId") SELECT "courseNo", "role", "section", "userId" FROM "SectionInstructor";
DROP TABLE "SectionInstructor";
ALTER TABLE "new_SectionInstructor" RENAME TO "SectionInstructor";
CREATE TABLE "new_Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "phoneNo" TEXT NOT NULL
);
INSERT INTO "new_Student" ("email", "gender", "id", "major", "name", "phoneNo") SELECT "email", "gender", "id", "major", "name", "phoneNo" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE TABLE "new_admin" (
    "name" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "phoneNo" TEXT NOT NULL,
    "collage" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT NOT NULL
);
INSERT INTO "new_admin" ("collage", "email", "id", "name", "phoneNo", "role") SELECT "collage", "email", "id", "name", "phoneNo", "role" FROM "admin";
DROP TABLE "admin";
ALTER TABLE "new_admin" RENAME TO "admin";
CREATE TABLE "new_instructor" (
    "name" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY,
    "phoneNo" TEXT NOT NULL,
    "collage" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT NOT NULL
);
INSERT INTO "new_instructor" ("collage", "email", "id", "name", "phoneNo", "role") SELECT "collage", "email", "id", "name", "phoneNo", "role" FROM "instructor";
DROP TABLE "instructor";
ALTER TABLE "new_instructor" RENAME TO "instructor";
CREATE TABLE "new_login" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    CONSTRAINT "login_id_fkey" FOREIGN KEY ("id") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "login_id_fkey" FOREIGN KEY ("id") REFERENCES "admin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "login_id_fkey" FOREIGN KEY ("id") REFERENCES "instructor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_login" ("email", "id", "password", "role") SELECT "email", "id", "password", "role" FROM "login";
DROP TABLE "login";
ALTER TABLE "new_login" RENAME TO "login";
CREATE UNIQUE INDEX "login_email_key" ON "login"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
