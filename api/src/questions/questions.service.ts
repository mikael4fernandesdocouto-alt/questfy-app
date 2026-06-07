import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(subject?: string, difficulty?: string, examType?: string, page = 1, limit = 20) {
    const where: any = {};
    if (subject) where.subject = subject;
    if (difficulty) where.difficulty = difficulty;
    if (examType) where.examType = examType;

    const [questions, total] = await Promise.all([
      this.prisma.question.findMany({
        where,
        include: { alternatives: { select: { id: true, text: true, isCorrect: false } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.question.count({ where }),
    ]);
    return { questions, total, page, limit };
  }

  async findOne(id: string) {
    return this.prisma.question.findUnique({
      where: { id },
      include: { alternatives: { select: { id: true, text: true, isCorrect: false } } },
    });
  }

  async findOneWithAnswer(id: string) {
    return this.prisma.question.findUnique({
      where: { id },
      include: { alternatives: true },
    });
  }

  async getRandom(subject?: string, difficulty?: string, excludeIds: string[] = []) {
    const where: any = { id: { notIn: excludeIds.length > 0 ? excludeIds : undefined } };
    if (subject) where.subject = subject;
    if (difficulty) where.difficulty = difficulty;

    const count = await this.prisma.question.count({ where });
    if (count === 0) return null;

    const skip = Math.floor(Math.random() * count);
    const [question] = await this.prisma.question.findMany({
      where,
      include: { alternatives: { select: { id: true, text: true, isCorrect: false } } },
      skip,
      take: 1,
    });
    return question;
  }

  async countBySubject() {
    return this.prisma.$queryRaw`
      SELECT "subject", COUNT(*)::int as count FROM "questions" GROUP BY "subject"
    `;
  }
}
