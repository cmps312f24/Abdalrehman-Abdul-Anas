-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_login" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "adminId" TEXT,
    "instructorId" TEXT,
    "studentId" TEXT,
    CONSTRAINT "login_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "login_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "instructor" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "login_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_login" ("email", "id", "password", "role") SELECT "email", "id", "password", "role" FROM "login";
DROP TABLE "login";
ALTER TABLE "new_login" RENAME TO "login";
CREATE UNIQUE INDEX "login_email_key" ON "login"("email");
CREATE UNIQUE INDEX "login_adminId_key" ON "login"("adminId");
CREATE UNIQUE INDEX "login_instructorId_key" ON "login"("instructorId");
CREATE UNIQUE INDEX "login_studentId_key" ON "login"("studentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
