-- CreateTable
CREATE TABLE "job" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "salary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "application" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jobId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "resume" TEXT NOT NULL,
    CONSTRAINT "application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
