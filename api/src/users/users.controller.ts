import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Perfil do usuário logado' })
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @Get('me/stats')
  @ApiOperation({ summary: 'Estatísticas do usuário' })
  async getStats(@Request() req) {
    return this.usersService.getStats(req.user.id);
  }

  @Get('me/achievements')
  @ApiOperation({ summary: 'Conquistas do usuário' })
  async getAchievements(@Request() req) {
    return this.usersService.getAchievements(req.user.id);
  }
}
