import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    description: 'Judul buku.',
    example: 'Belajar NestJS',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Penulis buku.',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  author: string;

  @ApiProperty({
    description: 'Jumlah stok buku yang tersedia.',
    example: 10,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0, { message: 'Stok buku tidak boleh kurang dari 0' })
  stock: number;
}
