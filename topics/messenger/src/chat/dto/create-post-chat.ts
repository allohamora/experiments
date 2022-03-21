import { IsInt } from 'class-validator';

export class CreatePostChatDto {
  @IsInt()
  postId: number;
}
