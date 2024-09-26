import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBorrowBookDto } from './dto/create-borrow-book.dto';
import { UpdateBorrowBookDto } from './dto/update-borrow-book.dto';

@Injectable()
export class BorrowBookService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBorrowBookDto: CreateBorrowBookDto) {
    try {
      // Cek stok buku berdasarkan kode buku
      const book = await this.prisma.book.findUnique({
        where: { code: createBorrowBookDto.bookCode },
        select: { stock: true },
      });

      // Jika buku tidak ditemukan atau stok habis, lemparkan error
      if (!book || book.stock <= 0) {
        throw new NotFoundException(
          `Book with code ${createBorrowBookDto.bookCode} is not available.`,
        );
      }

      // Cek informasi member berdasarkan kode member
      const member = await this.prisma.member.findUnique({
        where: {
          code: createBorrowBookDto.memberCode,
        },
      });

      // Jika member sedang dalam status penalti, tolak peminjaman
      if (member.isPenalized) {
        throw new ForbiddenException(
          'You are currently penalized and cannot borrow books.',
        );
      }

      // Hitung jumlah buku yang belum dikembalikan oleh member
      const unreturnedBooksCount = await this.prisma.borrowRecords.count({
        where: {
          memberCode: createBorrowBookDto.memberCode,
          isReturned: false,
        },
      });

      // Jika member sudah meminjam 2 buku dan belum mengembalikan, tolak peminjaman baru
      if (unreturnedBooksCount >= 2) {
        throw new ForbiddenException(
          'You have already borrowed 2 books. Please return them before borrowing more.',
        );
      }

      // Buat catatan peminjaman baru dengan tanggal pengembalian maksimum 7 hari dari sekarang
      const newBorrowRecord = await this.prisma.borrowRecords.create({
        data: {
          ...createBorrowBookDto,
          maxReturnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        select: {
          id: true,
          memberCode: true,
          bookCode: true,
          borrowDate: true,
        },
      });

      // Jika catatan peminjaman berhasil dibuat, kurangi stok buku
      if (newBorrowRecord) {
        await this.prisma.book.update({
          where: {
            code: createBorrowBookDto.bookCode,
          },
          data: {
            stock: {
              decrement: 1,
            },
          },
        });
      }

      return newBorrowRecord;
    } catch (error) {
      // Jika ada error, lemparkan error internal
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prisma.borrowRecords.findMany({
        select: {
          id: true,
          memberCode: true,
          bookCode: true,
          borrowDate: true,
          returnDate: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch borrowed books');
    }
  }

  async findOne(id: string) {
    const borrowRecords = await this.prisma.borrowRecords.findUnique({
      where: { id },
      select: {
        id: true,
        memberCode: true,
        bookCode: true,
        borrowDate: true,
        returnDate: true,
      },
    });

    if (!borrowRecords) {
      throw new NotFoundException(`Borrowed book with id ${id} not found`);
    }

    return borrowRecords;
  }

  async update(id: string, updateBorrowBookDto: UpdateBorrowBookDto) {
    try {
      const updatedborrowRecords = await this.prisma.borrowRecords.update({
        where: { id },
        data: updateBorrowBookDto,
        select: {
          id: true,
          memberCode: true,
          bookCode: true,
          borrowDate: true,
          returnDate: true,
        },
      });
      return updatedborrowRecords;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update borrowed book with id ${id}`,
      );
    }
  }

  async remove(id: string) {
    try {
      const borrowRecords = await this.prisma.borrowRecords.findUnique({
        where: { id },
      });

      if (!borrowRecords) {
        throw new NotFoundException(`Borrowed book with id ${id} not found`);
      }

      await this.prisma.borrowRecords.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete borrowed book with id ${id}`,
      );
    }
  }

  async search(memberCode?: string, bookCode?: string) {
    try {
      const whereConditions = {};

      if (memberCode) {
        whereConditions['memberCode'] = {
          contains: memberCode,
          mode: 'insensitive',
        };
      }

      if (bookCode) {
        whereConditions['bookCode'] = {
          contains: bookCode,
          mode: 'insensitive',
        };
      }

      const records = await this.prisma.borrowRecords.findMany({
        where: whereConditions,
        select: {
          id: true,
          memberCode: true,
          bookCode: true,
          borrowDate: true,
          returnDate: true,
        },
      });

      return records;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch borrowed records by member code or book code',
      );
    }
  }

  async returnBook(bookCode: string, memberCode: string) {
    try {
      // Temukan catatan peminjaman berdasarkan kode buku dan kode member
      const borrowRecord = await this.prisma.borrowRecords.findFirst({
        where: {
          bookCode,
          memberCode,
          isReturned: false,
        },
        select: {
          id: true,
          bookCode: true,
          memberCode: true,
          maxReturnDate: true,
        },
      });

      // Jika catatan peminjaman tidak ditemukan, lempar error
      if (!borrowRecord) {
        throw new NotFoundException(
          `No borrow record found for book code ${bookCode} and member code ${memberCode}.`,
        );
      }

      // Update stok buku dengan menambah 1
      await this.prisma.book.update({
        where: {
          code: bookCode,
        },
        data: {
          stock: {
            increment: 1,
          },
        },
      });

      // Update status catatan peminjaman menjadi dikembalikan
      await this.prisma.borrowRecords.update({
        where: {
          id: borrowRecord.id,
        },
        data: {
          isReturned: true,
          returnDate: new Date(Date.now()),
        },
      });

      // Cek apakah pengembalian buku terlambat lebih dari 7 hari
      if (new Date() > borrowRecord.maxReturnDate) {
        const lateDays = Math.floor(
          (new Date().getTime() - borrowRecord.maxReturnDate.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        // Jika buku dikembalikan lebih dari 7 hari setelah batas, berikan sanksi
        if (lateDays >= 7) {
          await this.prisma.member.update({
            where: { code: memberCode },
            data: {
              penaltyExpires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Sanksi selama 3 hari
              isPenalized: true,
            },
          });
        }
      }

      return { message: 'Book returned successfully.' };
    } catch (error) {
      // Lempar error jika terjadi masalah
      throw error;
    }
  }
}
