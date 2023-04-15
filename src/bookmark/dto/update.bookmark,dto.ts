import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class updateBookmarkDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  title?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  @IsOptional()
  link?: string;
}
