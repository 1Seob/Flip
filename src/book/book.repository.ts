import { PrismaService } from 'src/common/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { BookData } from './type/book-data.type';
import { SaveBookData } from './type/save-book-data.type';

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
      },
    });
  }

  async saveBook(data: SaveBookData, paragraphs: string[]): Promise<BookData> {
    return this.prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
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

  async getBookByTitle(title: string): Promise<BookData | null> {
    return this.prisma.book.findFirst({
      where: {
        title,
      },
      select: {
        id: true,
        title: true,
        author: true,
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
}
