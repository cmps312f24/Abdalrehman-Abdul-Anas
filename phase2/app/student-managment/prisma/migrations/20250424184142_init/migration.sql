-- CreateTable
CREATE TABLE "Course" (
    "courseNo" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "credit" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "college" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Section" (
    "courseNo" TEXT NOT NULL,
    "section" TEXT NOT NULL,

    PRIMARY KEY ("courseNo", "section"),
    CONSTRAINT "Section_courseNo_fkey" FOREIGN KEY ("courseNo") REFERENCES "Course" ("courseNo") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SectionInstructor" (
    "courseNo" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,

    PRIMARY KEY ("userId", "courseNo", "section"),
    CONSTRAINT "SectionInstructor_courseNo_section_fkey" FOREIGN KEY ("courseNo", "section") REFERENCES "Section" ("courseNo", "section") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SectionInstructor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "admin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SectionInstructor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "instructor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "phoneNo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "studentId" INTEGER NOT NULL,
    "courseNo" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "grade" TEXT,

    PRIMARY KEY ("studentId", "courseNo", "section"),
    CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Enrollment_courseNo_section_fkey" FOREIGN KEY ("courseNo", "section") REFERENCES "Section" ("courseNo", "section") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GPARecord" (
    "ch" INTEGER NOT NULL,
    "gpa" REAL NOT NULL,
    "studentId" INTEGER NOT NULL,

    PRIMARY KEY ("studentId", "ch"),
    CONSTRAINT "GPARecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "admin" (
    "name" TEXT NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phoneNo" TEXT NOT NULL,
    "collage" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "instructor" (
    "name" TEXT NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phoneNo" TEXT NOT NULL,
    "collage" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "login" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    CONSTRAINT "login_id_fkey" FOREIGN KEY ("id") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "login_id_fkey" FOREIGN KEY ("id") REFERENCES "admin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "login_id_fkey" FOREIGN KEY ("id") REFERENCES "instructor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "University" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "info" TEXT NOT NULL,
    "events" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Path" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "universityName" TEXT NOT NULL,
    CONSTRAINT "Path_universityName_fkey" FOREIGN KEY ("universityName") REFERENCES "University" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PathCourse" (
    "pathName" TEXT NOT NULL PRIMARY KEY,
    "courseNo" TEXT NOT NULL,
    "prerequests" TEXT,
    CONSTRAINT "PathCourse_pathName_fkey" FOREIGN KEY ("pathName") REFERENCES "Path" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PathCourse_courseNo_fkey" FOREIGN KEY ("courseNo") REFERENCES "Course" ("courseNo") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "login_email_key" ON "login"("email");
