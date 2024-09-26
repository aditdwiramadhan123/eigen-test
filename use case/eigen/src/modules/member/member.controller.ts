import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Res,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('members')
@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  // Create a new member
  @Post('create')
  async create(@Res() res: Response, @Body() createMemberDto: CreateMemberDto) {
    try {
      const newMember = await this.memberService.create(createMemberDto);
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Member created successfully',
        data: newMember,
      });
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to create member',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get all members
  @Get('all')
  async findAll(@Res() res: Response) {
    try {
      const members = await this.memberService.findAll();
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Members retrieved successfully',
        data: members,
      });
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message || 'Members not found',
          error: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // Get member by code
  @Get('find/:code')
  async findOne(@Res() res: Response, @Param('code') code: string) {
    try {
      const member = await this.memberService.findOne(code);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Member retrieved successfully',
        data: member,
      });
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message || 'Member not found',
          error: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // Update member by code
  @Patch('update/:code')
  async update(
    @Res() res: Response,
    @Param('code') code: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    try {
      const updatedMember = await this.memberService.update(
        code,
        updateMemberDto,
      );
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Member updated successfully',
        data: updatedMember,
      });
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: error.message || 'Member not found',
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

  // Delete member by code
  @Get('delete/:code')
  async remove(@Res() res: Response, @Param('code') code: string) {
    try {
      await this.memberService.remove(code);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Member with code ${code} deleted successfully`,
      });
    } catch (error) {
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
}
