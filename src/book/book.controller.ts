import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { BookService } from './book.service';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BookDto } from './dto/book.dto';
import { SaveBookPayload } from './payload/save-book.payload';

@Controller('books')
@ApiTags('Book API')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get(':bookId')
  @ApiOperation({ summary: '책 정보를 가져옵니다' })
  @ApiOkResponse({ type: BookDto })
  async getBookById(@Param('bookId') bookId: number): Promise<BookDto> {
    return this.bookService.getBookById(bookId);
  }

  @Get('title/:title')
  @ApiOperation({ summary: '제목으로 책 정보를 가져옵니다' })
  @ApiOkResponse({ type: BookDto })
  async getBookByTitle(@Param('title') title: string): Promise<BookDto> {
    return this.bookService.getBookByTitle(title);
  }

  @Get(':bookId/paragraphs')
  @ApiOperation({ summary: '책 문단을 30일 분량으로 가져옵니다' })
  @ApiOkResponse({
    type: [String],
    description: '30일 분량으로 나눠진 문단 목록',
  })
  async getBookParagraphs(
    @Param('bookId') bookId: number,
  ): Promise<string[][]> {
    return this.bookService.getBookParagraphs(bookId);
  }

  @Post('save/:fileName')
  @ApiOperation({ summary: '책 추가' })
  @ApiOkResponse({ type: BookDto })
  async saveBook(
    @Param('fileName') fileName: string,
    @Body() payload: SaveBookPayload,
  ): Promise<BookDto> {
    return this.bookService.saveBook(fileName, payload);
  }
  // 프로젝트 루트 디렉토리에 있는 원문 텍스트 파일의 이름을 fileName으로 받습니다. ex) Frankenstein.txt

  @Delete(':bookId')
  @HttpCode(204)
  @ApiOperation({ summary: '책 삭제' })
  @ApiNoContentResponse()
  async deleteBook(@Param('bookId') bookId: number): Promise<void> {
    return this.bookService.deleteBook(bookId);
  }
}
