import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerDto {
  @ApiProperty({ example: 'clx...' })
  @IsString()
  questionId: string = '';

  @ApiProperty({ example: 'clx...' })
  @IsString()
  selectedAltId: string = '';
}
