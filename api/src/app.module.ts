import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './common/config/configuration';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QuestionsModule } from './questions/questions.module';
import { MissionsModule } from './missions/missions.module';
import { GameModule } from './game/game.module';
import { RankingModule } from './ranking/ranking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    QuestionsModule,
    MissionsModule,
    GameModule,
    RankingModule,
  ],
})
export class AppModule {}
