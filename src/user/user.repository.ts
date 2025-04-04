import { PrismaService } from '../common/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UpdateUserData } from '../auth/type/update-user-data.type';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(userId: number): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
    });
  }

  async updateUser(userId: number, data: UpdateUserData): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: data.name,
        email: data.email,
      },
    });
  }

  async isEmailExist(email: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });

    return !!user;
  }

  async deleteUser(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async getAllUsersWithBooks(): Promise<{ id: number; likedBookIds: number[]; readBookIds: number[] }[]> {
    const users = await this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        bookLikes: {
          select: {
            bookId: true,
          },
        },
        userBooks: {
          select: {
            bookId: true,
          },
        },
      },
    });
    
    return users.map((user) => ({
      id: user.id,
      likedBookIds: user.bookLikes.map((like) => like.bookId),
      readBookIds: user.userBooks.map((read) => read.bookId),
    }));
  }
}
