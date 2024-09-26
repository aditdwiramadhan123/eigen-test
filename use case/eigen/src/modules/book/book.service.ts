import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    try {
      const newBook = await this.prisma.book.create({
        data: createBookDto,
        select: {
          code: true,
          title: true,
          author: true,
          stock: true,
        },
      });
      return newBook;
    } catch (error) {
      throw new InternalServerErrorException('Failed to add a new book');
    }
  }

  async findAll() {
    try {
      return await this.prisma.book.findMany({
        select: {
          code: true,
          title: true,
          author: true,
          stock: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch books');
    }
  }

  async findOne(code: string) {
    const book = await this.prisma.book.findUnique({
      where: { code },
      select: {
        code: true,
        title: true,
        author: true,
        stock: true,
      },
    });

    if (!book) {
      throw new NotFoundException(`Book with code ${code} not found`);
    }

    return book;
  }

  async update(code: string, updateBookDto: UpdateBookDto) {
    try {
      const updatedBook = await this.prisma.book.update({
        where: { code },
        data: updateBookDto,
        select: {
          code: true,
          title: true,
          author: true,
          stock: true,
        },
      });
      return updatedBook;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update book with code ${code}`,
      );
    }
  }

  async remove(code: string) {
    try {
      const book = await this.prisma.book.findUnique({
        where: { code },
      });

      if (!book) {
        throw new NotFoundException(`Book with code ${code} not found`);
      }

      await this.prisma.book.delete({
        where: { code },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete book with code ${code}`,
      );
    }
  }
}
