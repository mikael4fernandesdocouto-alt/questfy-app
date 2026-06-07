import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MissionsService } from './missions.service';

@ApiTags('missions')
@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar missões ativas' })
  async getActive() {
    return this.missionsService.getActiveMissions();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Minhas missões' })
  async getMyMissions(@Request() req) {
    return this.missionsService.getUserMissions(req.user.id);
  }

  @Post('assign')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atribuir missão' })
  async assign(@Request() req, @Body('missionId') missionId: string) {
    return this.missionsService.assignMission(req.user.id, missionId);
  }

  @Post('progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar progresso' })
  async progress(@Request() req, @Body('missionId') missionId: string, @Body('progress') progress: number) {
    return this.missionsService.updateProgress(req.user.id, missionId, progress);
  }
}
