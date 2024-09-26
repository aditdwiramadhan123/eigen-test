import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class CreateMemberDto {
  @ApiProperty({
    description:
      'The username of the user. Must be at least 4 characters long.',
    example: 'user123',
    minLength: 4,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4, {
    message: 'Username must be at least 4 characters long',
  })
  username: string;
}
