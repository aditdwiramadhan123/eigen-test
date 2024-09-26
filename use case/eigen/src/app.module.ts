import { Module } from '@nestjs/common';
import { MemberModule } from './modules/member/member.module';
import { BookModule } from './modules/book/book.module';
import { BorrowBookModule } from './modules/borrow-book/borrow-book.module';

@Module({
  imports: [MemberModule, BookModule, BorrowBookModule],
})
export class AppModule {}
