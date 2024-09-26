import { ApiProperty } from '@nestjs/swagger';

export class ReadMemberDto {
  @ApiProperty({
    description: 'The unique identifier (ID) of the user.',
    example: 'c56a4180-65aa-42ec-a945-5fd21dec0538',
  })
  code: string;

  @ApiProperty({
    description: 'The username of the user.',
    example: 'user123',
  })
  username: string;
}
