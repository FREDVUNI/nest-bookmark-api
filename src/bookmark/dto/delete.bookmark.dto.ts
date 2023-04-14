import { IsNotEmpty } from 'class-validator';

export class DeleteBookmakrkDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  userId: number;
}
