import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import {
  CreateBookmarkDto,
  UpdateBookmarkDto,
  DeleteBookmakrkDto,
} from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    await this.prisma.bookmark.create({
      data: {
        title: dto.title,
        link: dto.link,
        description: dto.description,
        userId: userId,
      },
    });
  }
  getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: { userId: userId },
    });
  }
  getBookmark(userId: number, bookmarkId: number) {
    return this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }
  async editBookmark(
    userId: number,
    bookmarkId: number,
    dto: UpdateBookmarkDto,
  ) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access has been denied.');
    return this.prisma.bookmark.update({
      data: {
        ...dto,
      },
      where: {
        id: bookmarkId,
      },
    });
  }
  async deleteBookmark(
    userId: number,
    bookmarkId: number,
    dto: DeleteBookmakrkDto,
  ) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access has been denied.');
    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }

  async getBookmarkById(
    bookmarkId: number,
    userId: number,
    updateDto?: UpdateBookmarkDto,
    deleteDto?: DeleteBookmakrkDto,
  ) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access has been denied.');

    if (!bookmark || bookmark.userId !== deleteDto.userId)
      throw new ForbiddenException('Access has been denied.');
  }
}
