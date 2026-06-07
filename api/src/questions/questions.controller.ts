import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QuestionsService } from './questions.service';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar questões' })
  @ApiQuery({ name: 'subject', required: false, enum: ['MATEMATICA','LINGUAGENS','CIENCIAS_HUMANAS','CIENCIAS_NATUREZA','REDACAO'] })
  @ApiQuery({ name: 'difficulty', required: false, enum: ['EASY','MEDIUM','HARD'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('subject') subject?: string,
    @Query('difficulty') difficulty?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.questionsService.findAll(subject, difficulty, undefined, page || 1, limit || 20);
  }

  @Get('random')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Questão aleatória' })
  async getRandom(@Query('subject') subject?: string, @Query('difficulty') difficulty?: string) {
    return this.questionsService.getRandom(subject, difficulty);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Estatísticas de questões por matéria' })
  async getStats() {
    return this.questionsService.countBySubject();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Detalhes de uma questão' })
  async findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }
}
