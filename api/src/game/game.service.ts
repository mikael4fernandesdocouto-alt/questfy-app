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

    const oldLevel = await this.getUserLevel(userId);
    const user = await this.updateUserXp(userId, xpEarned);
    const newLevel = user.level;
    const leveledUp = newLevel > oldLevel;

    await this.updateStreak(userId);
    await this.updateWeeklyLog(userId, xpEarned, isCorrect);
    const newAchievements = await this.checkAchievements(userId);
    const newTitles = await this.checkTitles(user);

    return {
      answer: { id: answer.id, isCorrect, xpEarned },
      user: {
        xp: user.xp, totalXp: user.totalXp, level: user.level,
        rank: user.rank, xpToNextLevel: user.xpToNextLevel, streak: user.streak,
      },
      leveledUp,
      oldLevel,
      newLevel,
      newAchievements,
      newTitles,
      explanation: isCorrect ? question.explanation : null,
    };
  }

  private async getUserLevel(userId: string): Promise<number> {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { level: true } });
    return user?.level || 1;
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

  private async updateWeeklyLog(userId: string, xpEarned: number, isCorrect: boolean) {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);

    await this.prisma.weeklyLog.upsert({
      where: { userId_weekStart_dayOfWeek: { userId, weekStart: monday, dayOfWeek } },
      update: {
        xpEarned: { increment: xpEarned },
        questionsAnswered: { increment: 1 },
        correctAnswers: isCorrect ? { increment: 1 } : undefined,
      },
      create: { userId, weekStart: monday, dayOfWeek, xpEarned, questionsAnswered: 1, correctAnswers: isCorrect ? 1 : 0 },
    });
  }

  private async checkAchievements(userId: string) {
    const achievements = await this.prisma.achievement.findMany();
    const unlocked = (await this.prisma.userAchievement.findMany({ where: { userId }, select: { achievementId: true } })).map(u => u.achievementId);
    const newlyUnlocked = [];

    for (const a of achievements) {
      if (unlocked.includes(a.id)) continue;
      if (await this.evaluateCondition(userId, JSON.parse(a.condition))) {
        await this.prisma.userAchievement.create({ data: { userId, achievementId: a.id } });
        newlyUnlocked.push(a);
      }
    }
    return newlyUnlocked;
  }

  private async checkTitles(user: any) {
    const titles = await this.prisma.title.findMany();
    const unlocked = (await this.prisma.userTitle.findMany({ where: { userId: user.id }, select: { titleId: true } })).map(u => u.titleId);
    const newlyUnlocked = [];

    for (const t of titles) {
      if (unlocked.includes(t.id)) continue;
      if (user.totalXp >= t.requiredXp && (!t.requiredRank || this.rankGte(user.rank, t.requiredRank))) {
        await this.prisma.userTitle.create({ data: { userId: user.id, titleId: t.id } });
        newlyUnlocked.push(t);
      }
    }
    return newlyUnlocked;
  }

  private rankGte(rank: string, required: string): boolean {
    const order = ['E', 'D', 'C', 'B', 'A', 'S'];
    return order.indexOf(rank) >= order.indexOf(required);
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
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userTitles: { include: { title: true }, orderBy: { unlockedAt: 'desc' }, take: 3 },
      },
    });

    const [totalAnswers, correctAnswers, recentAchievements, activeMissions, weeklyLog] = await Promise.all([
      this.prisma.answer.count({ where: { userId } }),
      this.prisma.answer.count({ where: { userId, isCorrect: true } }),
      this.prisma.userAchievement.findMany({ where: { userId }, include: { achievement: true }, orderBy: { unlockedAt: 'desc' }, take: 5 }),
      this.prisma.userMission.findMany({ where: { userId, completed: false }, include: { mission: true }, take: 10 }),
      this.getWeeklyLog(userId),
    ]);

    const subjectStats = await this.prisma.$queryRaw`
      SELECT q."subject",
        COUNT(*)::int as total,
        SUM(CASE WHEN a."isCorrect" THEN 1 ELSE 0 END)::int as correct
      FROM "answers" a
      JOIN "questions" q ON a."questionId" = q."id"
      WHERE a."userId" = ${userId}
      GROUP BY q."subject"
    `;

    return {
      user: {
        id: user.id, username: user.username, xp: user.xp, totalXp: user.totalXp,
        level: user.level, rank: user.rank, xpToNextLevel: user.xpToNextLevel,
        streak: user.streak, plan: user.plan,
        activeTitle: user.userTitles[0]?.title || null,
        unlockedTitles: user.userTitles.length,
      },
      stats: {
        totalAnswers, correctAnswers,
        accuracy: totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0,
        subjectStats,
      },
      recentAchievements,
      activeMissions,
      weeklyLog,
    };
  }

  async getWeeklyLog(userId: string) {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);

    const logs = await this.prisma.weeklyLog.findMany({
      where: { userId, weekStart: monday },
      orderBy: { dayOfWeek: 'asc' },
    });

    // Fill in missing days with zeros
    const result = [];
    for (let i = 0; i < 7; i++) {
      const log = logs.find(l => l.dayOfWeek === i);
      const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
      result.push({
        day: dayNames[i],
        xp: log?.xpEarned || 0,
        questions: log?.questionsAnswered || 0,
        correct: log?.correctAnswers || 0,
      });
    }
    return result;
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userTitles: { include: { title: true }, orderBy: { unlockedAt: 'desc' } },
        achievements: { include: { achievement: true }, orderBy: { unlockedAt: 'desc' } },
      },
    });

    const [totalAnswers, correctAnswers] = await Promise.all([
      this.prisma.answer.count({ where: { userId } }),
      this.prisma.answer.count({ where: { userId, isCorrect: true } }),
    ]);

    const subjectStats = await this.prisma.$queryRaw`
      SELECT q."subject",
        COUNT(*)::int as total,
        SUM(CASE WHEN a."isCorrect" THEN 1 ELSE 0 END)::int as correct
      FROM "answers" a
      JOIN "questions" q ON a."questionId" = q."id"
      WHERE a."userId" = ${userId}
      GROUP BY q."subject"
    `;

    const allTitles = await this.prisma.title.findMany();
    const allAchievements = await this.prisma.achievement.findMany();

    return {
      user: {
        id: user.id, username: user.username, xp: user.xp, totalXp: user.totalXp,
        level: user.level, rank: user.rank, xpToNextLevel: user.xpToNextLevel,
        streak: user.streak, plan: user.plan, createdAt: user.createdAt,
      },
      stats: {
        totalAnswers, correctAnswers,
        accuracy: totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0,
        subjectStats,
      },
      titles: {
        unlocked: user.userTitles.map((ut: any) => ut.title),
        all: allTitles,
      },
      achievements: {
        unlocked: user.achievements.map((ua: any) => ua.achievement),
        all: allAchievements,
      },
    };
  }
}
