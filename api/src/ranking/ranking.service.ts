import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class RankingService {
  constructor(private readonly prisma: PrismaService) {}

  async getGlobal(season: string, page = 1, limit = 50) {
    const entries = await this.prisma.rankingEntry.findMany({
      where: { season },
      orderBy: { xpTotal: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { user: { select: { id: true, username: true, avatarUrl: true, rank: true, level: true } } },
    });
    const total = await this.prisma.rankingEntry.count({ where: { season } });
    return { entries: entries.map((e, i) => ({ position: (page - 1) * limit + i + 1, ...e })), total, page, limit };
  }

  async getUserPosition(userId: string, season: string) {
    const entry = await this.prisma.rankingEntry.findUnique({ where: { userId_season: { userId, season } } });
    if (!entry) return null;
    const higher = await this.prisma.rankingEntry.count({ where: { season, xpTotal: { gt: entry.xpTotal } } });
    return { position: higher + 1, ...entry };
  }

  async updateRanking(userId: string, season: string, xpTotal: number) {
    return this.prisma.rankingEntry.upsert({
      where: { userId_season: { userId, season } },
      update: { xpTotal },
      create: { userId, season, xpTotal },
    });
  }
}
