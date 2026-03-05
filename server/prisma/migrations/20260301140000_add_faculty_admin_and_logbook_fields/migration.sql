-- AlterEnum: Add faculty_admin role
ALTER TYPE "Role" ADD VALUE 'faculty_admin';

-- AlterTable: Add phone to users
ALTER TABLE "users" ADD COLUMN "phone" VARCHAR(20);

-- AlterTable: Add extended student fields
ALTER TABLE "students" ADD COLUMN "institution" VARCHAR(200) NOT NULL DEFAULT 'Northwest University, Kano';
ALTER TABLE "students" ADD COLUMN "course_of_study" VARCHAR(100);
ALTER TABLE "students" ADD COLUMN "year_of_study" VARCHAR(20);
ALTER TABLE "students" ADD COLUMN "permanent_address" TEXT;
ALTER TABLE "students" ADD COLUMN "parent_phone" VARCHAR(20);
ALTER TABLE "students" ADD COLUMN "company_address" TEXT;
ALTER TABLE "students" ADD COLUMN "industry_supervisor_name" VARCHAR(100);
ALTER TABLE "students" ADD COLUMN "industry_supervisor_phone" VARCHAR(20);

-- AlterTable: Add clock_in and clock_out to logs
ALTER TABLE "logs" ADD COLUMN "clock_in" VARCHAR(5);
ALTER TABLE "logs" ADD COLUMN "clock_out" VARCHAR(5);
