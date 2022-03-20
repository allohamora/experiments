import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateAudioDto } from './create-audio.dto';
import { CreateImageDto } from './create-image.dto';

export class SendMessageDto {
  @IsInt()
  chatId: number;

  @IsString()
  @MaxLength(3000)
  @IsOptional()
  text?: string;

  @ValidateNested()
  @IsOptional()
  audio?: CreateAudioDto;

  @ValidateNested()
  @IsOptional()
  image?: CreateImageDto;
}
