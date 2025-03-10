import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookRepository } from './book.repository';
import { BookDto } from './dto/book.dto';
import { SaveBookPayload } from './payload/save-book.payload';
import { SaveBookData } from './type/save-book-data.type';
import { parsing, distributeParagraphs } from './parsing';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  async getBookById(bookId: number): Promise<BookDto> {
    const book = await this.bookRepository.getBookById(bookId);

    if (!book) {
      throw new NotFoundException('책을 찾을 수 없습니다.');
    }

    return BookDto.from(book);
  }

  async getBookByTitle(title: string): Promise<BookDto> {
    const book = await this.bookRepository.getBookByTitle(title);
    if (!book) {
      throw new NotFoundException('책을 찾을 수 없습니다.');
    }
    return BookDto.from(book);
  }

  async saveBook(fileName: string, payload: SaveBookPayload): Promise<BookDto> {
    const isBookExist = await this.bookRepository.getBookByTitle(payload.title);
    if (isBookExist) {
      throw new ConflictException('이미 존재하는 책입니다.');
    }
    const paragraphs = parsing(fileName);
    const data: SaveBookData = {
      title: payload.title,
      author: payload.author,
    };
    const book = await this.bookRepository.saveBook(data, paragraphs);
    return BookDto.from(book);
  }

  async deleteBook(bookId: number): Promise<void> {
    const book = await this.bookRepository.getBookById(bookId);
    if (!book) {
      throw new NotFoundException('책을 찾을 수 없습니다.');
    }
    await this.bookRepository.deleteBook(bookId);
  }

  async getBookParagraphs(bookId: number): Promise<string[][]> {
    const paragraphs = await this.bookRepository.getParagraphsByBookId(bookId);
    if (paragraphs.length === 0) {
      throw new NotFoundException('책의 문단을 찾을 수 없습니다.');
    }

    return distributeParagraphs(paragraphs.map((p) => p.content));
  }
}
