-- CreateTable
CREATE TABLE "Course" (
    "courseNo" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "credit" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "college" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Section" (
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

-- CreateTable
CREATE TABLE "SectionInstructor" (
    "courseNo" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    PRIMARY KEY ("userId", "courseNo", "section"),
    CONSTRAINT "SectionInstructor_courseNo_section_fkey" FOREIGN KEY ("courseNo", "section") REFERENCES "Section" ("courseNo", "section") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SectionInstructor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "admin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SectionInstructor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "instructor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "studentId" TEXT NOT NULL,
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
    "ch" TEXT NOT NULL,
    "gpa" REAL NOT NULL,
    "studentId" TEXT NOT NULL,

    PRIMARY KEY ("studentId", "ch"),
    CONSTRAINT "GPARecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phoneNo" TEXT NOT NULL,
    "collage" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "instructor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phoneNo" TEXT NOT NULL,
    "collage" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "phoneNo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "login" (
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
CREATE UNIQUE INDEX "login_adminId_key" ON "login"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "login_instructorId_key" ON "login"("instructorId");

-- CreateIndex
CREATE UNIQUE INDEX "login_studentId_key" ON "login"("studentId");
