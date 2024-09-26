-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "penaltyExpires" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Book" (
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "BorrowRecords" (
    "id" TEXT NOT NULL,
    "memberCode" TEXT NOT NULL,
    "bookCode" TEXT NOT NULL,
    "borrowDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnDate" TIMESTAMP(3),

    CONSTRAINT "BorrowRecords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BorrowRecords_memberCode_bookCode_returnDate_key" ON "BorrowRecords"("memberCode", "bookCode", "returnDate");

-- AddForeignKey
ALTER TABLE "BorrowRecords" ADD CONSTRAINT "BorrowRecords_memberCode_fkey" FOREIGN KEY ("memberCode") REFERENCES "Member"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BorrowRecords" ADD CONSTRAINT "BorrowRecords_bookCode_fkey" FOREIGN KEY ("bookCode") REFERENCES "Book"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
