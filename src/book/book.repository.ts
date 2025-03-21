import { PrismaService } from 'src/common/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { BookData } from './type/book-data.type';
import { SaveBookData } from './type/save-book-data.type';
import { UpdateBookData } from './type/update-book-data.type';
import { BookQuery } from './query/book.query';

@Injectable()
export class BookRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getBookById(bookId: number): Promise<BookData | null> {
    return this.prisma.book.findUnique({
      where: {
        id: bookId,
      },
      select: {
        id: true,
        title: true,
        author: true,
        coverImageUrl: true,
      },
    });
  }

  async saveBook(data: SaveBookData, paragraphs: string[]): Promise<BookData> {
    return this.prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        coverImageUrl: data.coverImageUrl,
        paragraphs: {
          create: paragraphs.map((paragraph, i) => ({
            content: paragraph,
            order: i,
          })),
        },
      },
      select: {
        id: true,
        title: true,
        author: true,
        coverImageUrl: true,
      },
    });
  }

  async deleteBook(bookId: number): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.paragraph.deleteMany({
        where: {
          bookId,
        },
      }),
      this.prisma.book.delete({
        where: {
          id: bookId,
        },
      }),
    ]);
  }

  async getBookByTitleAndAuthor(
    title: string,
    author: string,
  ): Promise<BookData | null> {
    return this.prisma.book.findFirst({
      where: {
        title,
        author,
      },
      select: {
        id: true,
        title: true,
        author: true,
        coverImageUrl: true,
      },
    });
  }

  async getParagraphsByBookId(bookId: number): Promise<{ content: string }[]> {
    return this.prisma.paragraph.findMany({
      where: { bookId },
      select: {
        content: true,
      },
      orderBy: { order: 'asc' },
    });
  }

  async updateBook(bookId: number, data: UpdateBookData): Promise<BookData> {
    return this.prisma.book.update({
      where: { id: bookId },
      data: {
        title: data.title,
        author: data.author,
        ...(data.coverImageUrl !== undefined && {
          coverImageUrl: data.coverImageUrl,
        }), // undefined이면 기존 값 유지
      },
      select: {
        id: true,
        title: true,
        author: true,
        coverImageUrl: true,
      },
    });
  }

  async getBooks(query: BookQuery): Promise<BookData[]> {
    return this.prisma.book.findMany({
      where: {
        ...(query.title && { title: query.title }),
        ...(query.author && { author: query.author }),
      },
      select: {
        id: true,
        title: true,
        author: true,
        coverImageUrl: true,
      },
    });
  }
}
