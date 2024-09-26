/*
  Warnings:

  - Added the required column `maxReturnDate` to the `BorrowRecords` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BorrowRecords" ADD COLUMN     "maxReturnDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "returnDate" DROP NOT NULL,
ALTER COLUMN "isReturned" DROP DEFAULT;
