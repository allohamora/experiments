import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateAudioDto {
  @IsString()
  @MaxLength(300)
  src: string;

  @IsInt()
  length: number;
}
