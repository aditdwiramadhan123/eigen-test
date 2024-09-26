import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpException,
  Query,
} from '@nestjs/common';
import { BorrowBookService } from './borrow-book.service';
import { CreateBorrowBookDto } from './dto/create-borrow-book.dto';
import { Response } from 'express';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('borrow-books')
@Controller('borrow-books')
export class BorrowBookController {
  constructor(private readonly borrowBookService: BorrowBookService) {}

  @Post('add')
  async create(
    @Body() createBorrowBookDto: CreateBorrowBookDto,
    @Res() res: Response,
  ) {
    try {
      const newRecord =
        await this.borrowBookService.create(createBorrowBookDto);
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Borrow record created successfully',
        data: newRecord,
      });
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to create borrow record',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('all')
  async findAll(@Res() res: Response) {
    try {
      const records = await this.borrowBookService.findAll();
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Borrow records retrieved successfully',
        data: records,
      });
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to retrieve borrow records',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('search')
  @ApiQuery({
    name: 'memberCode',
    required: false,
    description: 'Code of the member',
  })
  @ApiQuery({
    name: 'bookCode',
    required: false,
    description: 'Code of the book',
  })
  async search(
    @Res() res: Response,
    @Query('memberCode') memberCode?: string,
    @Query('bookCode') bookCode?: string,
  ) {
    try {
      const records = await this.borrowBookService.search(memberCode, bookCode);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Borrow records retrieved successfully',
        data: records,
      });
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message || 'Borrow records not found',
          error: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('return')
  async returnBook(
    @Body() returnBookDto: CreateBorrowBookDto,
    @Res() res: Response,
  ) {
    try {
      await this.borrowBookService.returnBook(
        returnBookDto.bookCode,
        returnBookDto.memberCode,
      );
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Book returned successfully',
      });
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message,
          error: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
