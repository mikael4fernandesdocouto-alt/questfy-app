import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class MissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getActiveMissions() {
    return this.prisma.mission.findMany({ where: { active: true } });
  }

  async getUserMissions(userId: string) {
    return this.prisma.userMission.findMany({
      where: { userId },
      include: { mission: true },
      orderBy: { completed: 'asc' },
    });
  }

  async assignMission(userId: string, missionId: string) {
    const existing = await this.prisma.userMission.findFirst({ where: { userId, missionId } });
    if (existing) return existing;
    return this.prisma.userMission.create({ data: { userId, missionId }, include: { mission: true } });
  }

  async updateProgress(userId: string, missionId: string, progress: number) {
    const um = await this.prisma.userMission.findFirst({ where: { userId, missionId } });
    if (!um) throw new Error('Missão não atribuída');

    const mission = await this.prisma.mission.findUnique({ where: { id: missionId } });
    const completed = progress >= mission.targetCount;

    return this.prisma.userMission.update({
      where: { id: um.id },
      data: { progress, completed, completedAt: completed ? new Date() : null },
      include: { mission: true },
    });
  }
}
