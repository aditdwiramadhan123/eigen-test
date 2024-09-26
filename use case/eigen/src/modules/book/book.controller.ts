import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('addBook')
  async create(@Body() createBookDto: CreateBookDto, @Res() res: Response) {
    try {
      const newBook = await this.bookService.create(createBookDto);
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Book added!',
        data: newBook,
      });
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to add book',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('all')
  async findAll(@Res() res: Response) {
    try {
      const books = await this.bookService.findAll();
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Books retrieved successfully',
        data: books,
      });
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to retrieve books',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('find/:code')
  async findOne(@Param('code') code: string, @Res() res: Response) {
    try {
      const book = await this.bookService.findOne(code);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Book retrieved successfully',
        data: book,
      });
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message || 'Book not found',
          error: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('update/:code')
  async update(
    @Param('code') code: string,
    @Body() updateBookDto: UpdateBookDto,
    @Res() res: Response,
  ) {
    try {
      const updatedBook = await this.bookService.update(code, updateBookDto);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Book updated successfully',
        data: updatedBook,
      });
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: error.message || 'Book not found',
            error: 'Not Found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error occurred',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('delete/:code')
  async remove(@Param('code') code: string, @Res() res: Response) {
    try {
      await this.bookService.remove(code);
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message || 'Book not found',
          error: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
