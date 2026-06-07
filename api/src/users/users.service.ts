import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: ['id', 'email', 'username', 'avatarUrl', 'rank', 'level', 'xp', 'totalXp', 'xpToNextLevel', 'streak', 'plan', 'createdAt'],
    });
  }

  async getStats(id: string) {
    const [total, correct, bySubject] = await Promise.all([
      this.prisma.answer.count({ where: { userId: id } }),
      this.prisma.answer.count({ where: { userId: id, isCorrect: true } }),
      this.prisma.$queryRaw`
        SELECT q."subject", COUNT(*)::int as total,
          SUM(CASE WHEN a."isCorrect" THEN 1 ELSE 0 END)::int as correct
        FROM "answers" a JOIN "questions" q ON a."questionId" = q."id"
        WHERE a."userId" = ${id} GROUP BY q."subject"
      `,
    ]);
    return { totalAnswers: total, correctAnswers: correct, accuracy: total > 0 ? Math.round((correct / total) * 100) : 0, subjectStats: bySubject };
  }

  async getAchievements(id: string) {
    return this.prisma.userAchievement.findMany({
      where: { userId: id },
      include: { achievement: true },
      orderBy: { unlockedAt: 'desc' },
    });
  }
}
