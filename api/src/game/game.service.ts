import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

const XP_REWARDS = { EASY: 10, MEDIUM: 20, HARD: 40 };
const RANK_THRESHOLDS = [
  { rank: 'E', minXp: 0 },
  { rank: 'D', minXp: 500 },
  { rank: 'C', minXp: 1500 },
  { rank: 'B', minXp: 4000 },
  { rank: 'A', minXp: 8000 },
  { rank: 'S', minXp: 15000 },
];

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  async processAnswer(userId: string, questionId: string, selectedAltId: string) {
    const alternative = await this.prisma.alternative.findUnique({ where: { id: selectedAltId } });
    if (!alternative) throw new Error('Alternativa não encontrada');

    const isCorrect = alternative.isCorrect;
    const question = await this.prisma.question.findUnique({ where: { id: questionId } });
    const xpEarned = isCorrect ? XP_REWARDS[question.difficulty] : 0;

    const answer = await this.prisma.answer.create({
      data: { userId, questionId, selectedAltId, isCorrect, xpEarned },
    });

    const user = await this.updateUserXp(userId, xpEarned);
    await this.updateStreak(userId);
    const newAchievements = await this.checkAchievements(userId);

    return {
      answer: { id: answer.id, isCorrect, xpEarned },
      user: { xp: user.xp, totalXp: user.totalXp, level: user.level, rank: user.rank, xpToNextLevel: user.xpToNextLevel, streak: user.streak },
      newAchievements,
      explanation: isCorrect ? question.explanation : null,
    };
  }

  private async updateUserXp(userId: string, xpEarned: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    let newXp = user.xp + xpEarned;
    let newTotalXp = user.totalXp + xpEarned;
    let newLevel = user.level;
    let xpToNext = user.xpToNextLevel;

    while (newXp >= xpToNext) {
      newXp -= xpToNext;
      newLevel++;
      xpToNext = Math.floor(100 * Math.pow(1.15, newLevel - 1));
    }

    const newRank = this.determineRank(newTotalXp);

    return this.prisma.user.update({
      where: { id: userId },
      data: { xp: newXp, totalXp: newTotalXp, level: newLevel, xpToNextLevel: xpToNext, rank: newRank },
    });
  }

  private determineRank(totalXp: number): string {
    let rank = 'E';
    for (const t of RANK_THRESHOLDS) {
      if (totalXp >= t.minXp) rank = t.rank;
    }
    return rank;
  }

  private async updateStreak(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const today = new Date(); today.setHours(0, 0, 0, 0);

    if (user.lastStudyDate) {
      const last = new Date(user.lastStudyDate); last.setHours(0, 0, 0, 0);
      const diff = Math.floor((today.getTime() - last.getTime()) / 86400000);

      if (diff === 1) {
        await this.prisma.user.update({ where: { id: userId }, data: { streak: { increment: 1 }, lastStudyDate: new Date() } });
      } else if (diff > 1) {
        await this.prisma.user.update({ where: { id: userId }, data: { streak: 1, lastStudyDate: new Date() } });
      }
    } else {
      await this.prisma.user.update({ where: { id: userId }, data: { streak: 1, lastStudyDate: new Date() } });
    }
  }

  private async checkAchievements(userId: string) {
    const achievements = await this.prisma.achievement.findMany();
    const unlocked = (await this.prisma.userAchievement.findMany({ where: { userId }, select: { achievementId: true } })).map(u => u.achievementId);
    const newlyUnlocked = [];

    for (const a of achievements) {
      if (unlocked.includes(a.id)) continue;
      const cond = JSON.parse(a.condition);
      if (await this.evaluateCondition(userId, cond)) {
        await this.prisma.userAchievement.create({ data: { userId, achievementId: a.id } });
        newlyUnlocked.push(a);
      }
    }
    return newlyUnlocked;
  }

  private async evaluateCondition(userId: string, cond: any): Promise<boolean> {
    switch (cond.type) {
      case 'questions_answered': return (await this.prisma.answer.count({ where: { userId } })) >= cond.count;
      case 'correct_answers': return (await this.prisma.answer.count({ where: { userId, isCorrect: true } })) >= cond.count;
      case 'streak': { const u = await this.prisma.user.findUnique({ where: { id: userId } }); return u.streak >= cond.days; }
      case 'level': { const u = await this.prisma.user.findUnique({ where: { id: userId } }); return u.level >= cond.level; }
      case 'rank': { const u = await this.prisma.user.findUnique({ where: { id: userId } }); return u.rank === cond.rank; }
      default: return false;
    }
  }

  async getDashboard(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const [totalAnswers, correctAnswers, recentAchievements, activeMissions] = await Promise.all([
      this.prisma.answer.count({ where: { userId } }),
      this.prisma.answer.count({ where: { userId, isCorrect: true } }),
      this.prisma.userAchievement.findMany({ where: { userId }, include: { achievement: true }, orderBy: { unlockedAt: 'desc' }, take: 5 }),
      this.prisma.userMission.findMany({ where: { userId, completed: false }, include: { mission: true }, take: 10 }),
    ]);

    return {
      user: { id: user.id, username: user.username, xp: user.xp, totalXp: user.totalXp, level: user.level, rank: user.rank, xpToNextLevel: user.xpToNextLevel, streak: user.streak, plan: user.plan },
      stats: { totalAnswers, correctAnswers, accuracy: totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0 },
      recentAchievements,
      activeMissions,
    };
  }
}
