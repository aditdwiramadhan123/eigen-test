import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [MemberController],
  providers: [MemberService],
  imports: [PrismaModule],
})
export class MemberModule {}
