import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  ParseIntPipe,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BookService } from './book.service';
import {
  ApiConsumes,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BookDto } from './dto/book.dto';
import { SaveBookPayload } from './payload/save-book.payload';
import { PatchUpdateBookPayload } from './payload/patch-update-book.payload';
import { BookListDto } from './dto/book.dto';
import { BookQuery } from './query/book.query';

@Controller('books')
@ApiTags('Book API')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get(':bookId')
  @ApiOperation({ summary: '책 정보를 가져옵니다' })
  @ApiOkResponse({ type: BookDto })
  async getBookById(
    @Param('bookId', ParseIntPipe) bookId: number,
  ): Promise<BookDto> {
    return this.bookService.getBookById(bookId);
  }

  @Get()
  @ApiOperation({ summary: '책 제목과 작가로 책을 검색합니다' })
  @ApiOkResponse({ type: BookListDto })
  async getBooks(@Query() query: BookQuery): Promise<BookListDto> {
    return this.bookService.getBooks(query);
  }

  @Get(':bookId/paragraphs')
  @ApiOperation({ summary: '책 문단을 30일 분량으로 가져옵니다' })
  @ApiOkResponse({
    type: Number,
    isArray: true,
    description: '30일 분량으로 나눠진 문단 목록',
  })
  async getBookParagraphs(
    @Param('bookId', ParseIntPipe) bookId: number,
  ): Promise<number[][]> {
    return this.bookService.getBookParagraphs(bookId);
  }

  @Post('save/:fileName')
  @ApiOperation({ summary: '책 추가' })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: BookDto })
  @UseInterceptors(FileInterceptor('coverImage'))
  async saveBook(
    @Param('fileName') fileName: string,
    @Body() payload: SaveBookPayload,
    @UploadedFile() coverImageFile?: Express.Multer.File,
  ): Promise<BookDto> {
    return this.bookService.saveBook(fileName, payload, coverImageFile);
  }
  // 프로젝트 루트 디렉토리에 있는 원문 텍스트 파일의 이름을 fileName으로 받습니다. ex) Frankenstein.txt

  @Patch(':bookId')
  @ApiOperation({ summary: '책 정보 수정 (표지 이미지 포함)' })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: BookDto })
  @UseInterceptors(FileInterceptor('coverImage'))
  async updateBook(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body() payload: PatchUpdateBookPayload,
    @UploadedFile() coverImageFile?: Express.Multer.File,
  ): Promise<BookDto> {
    return this.bookService.patchUpdateBook(bookId, payload, coverImageFile);
  }

  @Delete(':bookId')
  @HttpCode(204)
  @ApiOperation({ summary: '책 삭제' })
  @ApiNoContentResponse()
  async deleteBook(
    @Param('bookId', ParseIntPipe) bookId: number,
  ): Promise<void> {
    return this.bookService.deleteBook(bookId);
  }
}
