import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBorrowBookDto {
  @ApiProperty({
    description: 'Code member yang meminjam buku.',
    example: 'member-uuid-1234',
  })
  @IsNotEmpty()
  @IsString()
  memberCode: string;

  @ApiProperty({
    description: 'Code buku yang dipinjam.',
    example: 'book-uuid-5678',
  })
  @IsNotEmpty()
  @IsString()
  bookCode: string;
}
