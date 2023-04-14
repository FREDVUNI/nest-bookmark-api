import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  Param,
  Body,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { JwtGuard } from '../../src/auth/guard';
import { GetUser } from '../../src/auth/decorator';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';

@Controller('bookmark')
@UseGuards(JwtGuard)
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post('create')
  create(@GetUser('id') userId: number, @Body() dto: CreateBookmarkDto) {
    return this.bookmarkService.createBookmark(userId, dto);
  }

  @Get('bookmarks')
  bookmarks(@GetUser('id') userId: number) {
    return this.bookmarkService.getBookmarks(userId);
  }

  @Get('/:id')
  bookmark(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.getBookmark(userId, bookmarkId);
  }

  @Patch('/:id')
  update(
    @GetUser() userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: UpdateBookmarkDto,
  ) {
    return this.bookmarkService.editBookmark(userId,bookmarkId,dto)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  delete(
    @GetUser() userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {}
}
