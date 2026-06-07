import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GameService } from './game.service';
import { AnswerDto } from './dto/answer.dto';

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('answer')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Responder uma questão' })
  @ApiResponse({ status: 201, description: 'Resposta processada' })
  async answer(@Request() req, @Body() dto: AnswerDto) {
    return this.gameService.processAnswer(req.user.id, dto.questionId, dto.selectedAltId);
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Dashboard do jogador' })
  async dashboard(@Request() req) {
    return this.gameService.getDashboard(req.user.id);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Perfil completo do jogador' })
  async profile(@Request() req) {
    return this.gameService.getProfile(req.user.id);
  }
}
