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
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';

@Controller('bookmark')
@UseGuards(JwtGuard)
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post()
  create(@GetUser('id') userId: number, @Body() dto: CreateBookmarkDto) {
    return this.bookmarkService.createBookmark(userId, dto);
  }

  @Get()
  bookmarks(@GetUser('id') userId: number) {}

  @Get(':/id')
  bookmark(
    @GetUser('id') userId: number,
    @Param('bookmarkId', ParseIntPipe) bookmarkId: number,
  ) {}

  @Patch(':/id')
  update(
    @GetUser() userId: number,
    @Param('bookmarkId', ParseIntPipe) bookmarkId: number,
    @Body() dto: UpdateBookmarkDto,
  ) {}

  @Delete(':/id')
  delete(
    @GetUser() userId: number,
    @Param('bookmarkId', ParseIntPipe) bookmarkId: number,
  ) {}
}
