import { PartialType } from '@nestjs/swagger';
import { CreateBorrowBookDto } from './create-borrow-book.dto';

export class UpdateBorrowBookDto extends PartialType(CreateBorrowBookDto) {}
