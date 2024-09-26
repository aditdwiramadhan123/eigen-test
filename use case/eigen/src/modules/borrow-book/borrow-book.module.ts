import { Module } from '@nestjs/common';
import { BorrowBookService } from './borrow-book.service';
import { BorrowBookController } from './borrow-book.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [BorrowBookController],
  providers: [BorrowBookService],
  imports: [PrismaModule],
})
export class BorrowBookModule {}
