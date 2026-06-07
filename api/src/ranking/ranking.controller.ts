import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RankingService } from './ranking.service';

@ApiTags('ranking')
@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  @ApiOperation({ summary: 'Ranking global' })
  @ApiQuery({ name: 'season', example: '2026' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getGlobal(@Query('season') season: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.rankingService.getGlobal(season || '2026', page || 1, limit || 50);
  }

  @Get('me')
  @UseGuards()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Minha posição no ranking' })
  async myPosition(@Request() req, @Query('season') season: string) {
    return this.rankingService.getUserPosition(req.user.id, season || '2026');
  }
}
