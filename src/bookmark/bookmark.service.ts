import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  createBookmark(userId:number,dto:CreateBookmarkDto) {
    return this.prisma.bookmark.create({
        data:{
            title:dto.title,
            link:dto.link,
            description:dto.description,
            userId:userId
        }
    })
  }
  getBookmarks(userId:number) {
    return this.prisma.bookmark.findUnique({
        where:{ userId:userId }
    })
  }
  getBookmark(userId:number,bookmarkId:number) {}
  editBookmark(userId:number,bookmarkId:number) {}
  deleteBookmark(userId:number,bookmarkId:number) {}
}
