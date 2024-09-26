/*
  Warnings:

  - Made the column `returnDate` on table `BorrowRecords` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BorrowRecords" ADD COLUMN     "isReturned" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "returnDate" SET NOT NULL;
