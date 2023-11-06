-- CreateEnum
CREATE TYPE "roles" AS ENUM ('customer', 'admin');

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "role" "roles" NOT NULL DEFAULT 'customer';
