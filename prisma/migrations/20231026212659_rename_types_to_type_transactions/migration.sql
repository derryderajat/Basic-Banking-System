/*
  Warnings:

  - You are about to drop the column `types` on the `Transactions` table. All the data in the column will be lost.
  - Added the required column `type` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "types",
ADD COLUMN     "type" "EnumTransactionType" NOT NULL;
