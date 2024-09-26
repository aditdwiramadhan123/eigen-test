import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ReadMemberDto } from './dto/read-member.dto';
import { CreateMemberDto } from './dto/create-member.dto';

@Injectable()
export class MemberService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMemberDto: CreateMemberDto) {
    try {
      const existingUser = await this.prisma.member.findUnique({
        where: { username: createMemberDto.username },
      });

      if (existingUser) {
        throw new InternalServerErrorException('Username already exists');
      }

      const newUser = await this.prisma.member.create({
        data: {
          username: createMemberDto.username,
        },
        select: {
          code: true,
          username: true,
        },
      });
      return newUser;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to create new member',
      );
    }
  }

  async findAll(): Promise<ReadMemberDto[]> {
    try {
      return await this.prisma.member.findMany({
        select: {
          code: true,
          username: true,
          _count: {
            select: {
              borrowRecords: {
                where: { isReturned: false },
              },
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async findOne(code: string): Promise<ReadMemberDto> {
    const user = await this.prisma.member.findUnique({
      where: { code },
      select: {
        code: true,
        username: true,
        _count: {
          select: {
            borrowRecords: {
              where: { isReturned: false },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${code} not found`);
    }

    return user;
  }

  async update(
    code: string,
    updateUserDto: UpdateMemberDto,
  ): Promise<ReadMemberDto> {
    try {
      const updatedUser = await this.prisma.member.update({
        where: { code },
        data: updateUserDto,
        select: {
          code: true,
          username: true,
        },
      });
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update user with ID ${code}`,
      );
    }
  }

  async remove(code: string): Promise<void> {
    try {
      const user = await this.prisma.member.findUnique({
        where: { code },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${code} not found`);
      }

      await this.prisma.member.delete({
        where: { code },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete user with ID ${code}`,
      );
    }
  }
}
