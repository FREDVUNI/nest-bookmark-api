import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateBookmarkDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  link?: string;
}
